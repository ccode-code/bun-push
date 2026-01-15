/**
 * npm 发布逻辑
 */
import { writeFileSync, readFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import type { PublishConfig } from "./types";
import { updateChangelog, readChangelog } from "./utils/changelog";
import { t } from "./i18n";

/**
 * 读取 package.json 中的版本号
 */
function readPackageVersion(packagePath: string): string {
  const packageJsonPath = join(packagePath, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
}

/**
 * 更新 package.json 中的版本号
 */
function updatePackageVersion(packagePath: string, newVersion: string): void {
  const packageJsonPath = join(packagePath, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  
  packageJson.version = newVersion;
  
  writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
    "utf-8"
  );
}

/**
 * 恢复 package.json 中的版本号
 */
function restorePackageVersion(packagePath: string, oldVersion: string): void {
  updatePackageVersion(packagePath, oldVersion);
}

/**
 * 恢复 CHANGELOG.md 文件
 */
function restoreChangelog(packagePath: string, oldContent: string): void {
  const changelogPath = join(packagePath, "CHANGELOG.md");
  
  if (oldContent === "") {
    // 如果原始内容为空，说明原始没有 changelog 文件，删除新创建的文件（如果存在）
    if (existsSync(changelogPath)) {
      try {
        unlinkSync(changelogPath);
      } catch (error) {
        // 如果删除失败，尝试写入空内容（作为后备方案）
        writeFileSync(changelogPath, "", "utf-8");
      }
    }
  } else {
    // 恢复原始内容
    writeFileSync(changelogPath, oldContent, "utf-8");
  }
}

/**
 * 创建 git tag
 */
async function createGitTag(tag: string): Promise<void> {
  const proc = Bun.spawn(["git", "tag", tag], {
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(t("git.createTagFailed", { exitCode }));
  }
}

/**
 * 删除 git tag（用于回滚）
 */
async function deleteGitTag(tag: string): Promise<void> {
  const proc = Bun.spawn(["git", "tag", "-d", tag], {
    stdout: "pipe",
    stderr: "pipe",
  });

  await proc.exited;
  // 即使删除失败也不抛出错误，因为 tag 可能不存在
}

/**
 * 推送 git tag
 */
async function pushGitTag(tag: string): Promise<void> {
  const proc = Bun.spawn(["git", "push", "origin", tag], {
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(t("git.pushTagFailed", { exitCode }));
  }
}

/**
 * 检查 npm 登录状态
 * 使用 bun pm whoami 检查登录状态
 */
async function checkNpmAuth(registry: string): Promise<void> {
  // Bun 的包管理器兼容 npm 命令
  const proc = Bun.spawn(
    ["bun", "pm", "whoami"],
    {
      stdout: "pipe",
      stderr: "pipe",
    }
  );

  const exitCode = await proc.exited;
  
  if (exitCode !== 0) {
    // 获取错误输出
    const stderr = await new Response(proc.stderr).text();
    const errorMsg = stderr.trim();
    
    // 检查是否是未登录错误
    if (errorMsg.includes("not logged in") || errorMsg.includes("Unauthorized") || errorMsg === "") {
      throw new Error(t("publish.npmNotLoggedIn", { registry }));
    }
    
    throw new Error(t("publish.npmAuthCheckFailed", { registry, error: errorMsg }));
  }

  // 获取用户名
  const stdout = await new Response(proc.stdout).text();
  const username = stdout.trim();
  
  if (!username) {
    throw new Error(t("publish.npmNotLoggedIn", { registry }));
  }
}

/**
 * 发布到 npm
 */
async function publishToNpm(packagePath: string, registry: string, otp?: string): Promise<void> {
  const args = ["bun", "publish", "--registry", registry];
  
  // 如果提供了 OTP，添加到命令参数中
  if (otp) {
    args.push("--otp", otp);
  }

  const proc = Bun.spawn(args, {
    cwd: packagePath,
    stdout: "inherit",
    stderr: "inherit",
    env: {
      ...process.env,
      NPM_CONFIG_REGISTRY: registry,
    },
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    return Promise.reject(new Error(t("publish.npmPublishFailed", { exitCode })));
  }
}

/**
 * 发布包
 * 如果发布失败，会自动回滚版本号和 changelog 的修改
 */
export async function publish(config: PublishConfig): Promise<void> {
  // 保存原始值，用于失败时回滚
  const originalVersion = readPackageVersion(config.package.path);
  const originalChangelog = config.generateChangelog 
    ? readChangelog(config.package.path) 
    : "";
  let gitTagCreated = false;

  try {
    // 1. 更新版本号
    updatePackageVersion(config.package.path, config.newVersion);

    // 2. 生成 changelog 文件（如果配置了）
    if (config.generateChangelog) {
      updateChangelog(config.package.path, config.newVersion, config.changelog);
    }

    // 3. 检查 npm 登录状态
    await checkNpmAuth(config.registry);

    // 4. 创建 git tag（如果配置了推送 tag）
    if (config.pushTag) {
      await createGitTag(config.tag);
      gitTagCreated = true;
    }

    // 5. 发布到 npm
    await publishToNpm(config.package.path, config.registry, config.otp);

    // 6. 推送 git tag（如果配置了）
    if (config.pushTag) {
      await pushGitTag(config.tag);
    }
  } catch (error) {
    // 发布失败，回滚修改
    console.error(t("publish.rollingBack") || "发布失败，正在回滚修改...");
    
    try {
      // 恢复版本号
      restorePackageVersion(config.package.path, originalVersion);
      
      // 恢复 changelog（如果修改了）
      if (config.generateChangelog) {
        restoreChangelog(config.package.path, originalChangelog);
      }
      
      // 删除已创建的 git tag（如果创建了）
      if (gitTagCreated) {
        await deleteGitTag(config.tag);
      }
      
      console.error(t("publish.rollbackComplete") || "回滚完成");
    } catch (rollbackError) {
      // 回滚失败，记录错误但不抛出，因为原始错误更重要
      console.error(
        t("publish.rollbackFailed") || "回滚失败，请手动恢复版本号和 changelog:",
        rollbackError
      );
    }
    
    // 重新抛出原始错误
    throw error;
  }
}
