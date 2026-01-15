import { build } from "bun";

/**
 * 构建配置文件
 * 将项目打包为 Bun 兼容的产物
 * 
 * 使用方式: bun run build.config.ts
 */

async function buildProject() {
  console.log("开始构建项目...");
  console.log("当前工作目录:", process.cwd());

  // 构建 CLI 入口点
  const cliResult = await build({
    entrypoints: ["./src/cli.ts"],
    outdir: "./dist",
    target: "bun", // 目标平台为 Bun
    format: "esm", // 使用 ESM 模块格式
    external: [
      "prompts",
      "chalk",
      "ora",
      "semver",
      "zod",
      "figlet",
      "@bunpm/registry",
    ],
    minify: false,
    sourcemap: "external",
  });

  if (!cliResult.success) {
    console.error("CLI 构建失败:");
    for (const log of cliResult.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  // 构建 JS API 入口点
  const apiResult = await build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "bun", // 目标平台为 Bun
    format: "esm", // 使用 ESM 模块格式
    external: [
      "prompts",
      "chalk",
      "ora",
      "semver",
      "zod",
      "figlet",
      "@bunpm/registry",
    ],
    minify: false,
    sourcemap: "external",
  });

  if (!apiResult.success) {
    console.error("API 构建失败:");
    for (const log of apiResult.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  console.log("构建完成！");
  console.log("CLI 输出:", cliResult.outputs.map((o) => o.path));
  console.log("API 输出:", apiResult.outputs.map((o) => o.path));

  // 确保 CLI 文件有正确的 shebang 和可执行权限
  const cliOutputPath = cliResult.outputs[0]?.path;
  if (cliOutputPath) {
    const cliFile = Bun.file(cliOutputPath);
    
    // 读取文件内容
    let content = await cliFile.text();
    
    // 如果文件开头没有 shebang，添加它
    if (!content.startsWith("#!/usr/bin/env bun")) {
      content = "#!/usr/bin/env bun\n" + content;
      await Bun.write(cliFile, content);
      console.log("已添加 shebang 到 CLI 文件");
    }
    
    // 设置可执行权限（Unix 系统）
    try {
      // 使用 Bun 的 API 设置权限
      const proc = Bun.spawn(["chmod", "+x", cliOutputPath], {
        stdout: "pipe",
        stderr: "pipe",
      });
      await proc.exited;
      if (proc.exitCode === 0) {
        console.log("已设置 CLI 文件可执行权限");
      }
    } catch (err) {
      // Windows 系统可能不支持 chmod，忽略错误
      console.log("跳过设置可执行权限（可能是不支持的系统）");
    }
  }

  // 生成类型声明文件
  console.log("生成类型声明文件...");
  const tscProcess = Bun.spawn([
    "bun",
    "x",
    "tsc",
    "--emitDeclarationOnly",
    "--declaration",
    "--declarationMap",
  ], {
    stdout: "inherit",
    stderr: "inherit",
  });

  await tscProcess.exited;
  
  if (tscProcess.exitCode !== 0) {
    console.error("\n类型声明文件生成失败");
    process.exit(1);
  }
  
  console.log("\n类型声明文件生成完成！");
}

// 执行构建
buildProject().catch((err) => {
  console.error("构建过程中发生错误:", err);
  process.exit(1);
});

// 导出构建函数，供其他脚本使用
export { buildProject };
