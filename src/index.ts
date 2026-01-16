/**
 * JS API 入口
 * 
 * Copyright (c) 2024 ccode
 * Licensed under the MIT License
 */
import { getWorkspaceInfo } from "./utils/workspace";
import { getNextVersion, isValidVersion } from "./utils/version";
import { runScript } from "./utils/scripts";
import { publish } from "./publisher";
import { resolve } from "path";
import type { PublishConfig, PublishOptions, PackageInfo } from "./types";
import { t } from "./i18n";

/**
 * bun-push 类
 */
export class NpmPush {
  private workspaceInfo: ReturnType<typeof getWorkspaceInfo>;

  constructor(workingDir?: string) {
    this.workspaceInfo = getWorkspaceInfo(workingDir);
  }

  /**
   * 获取 workspace 信息
   */
  getWorkspaceInfo() {
    return this.workspaceInfo;
  }

  /**
   * 获取所有包
   */
  getPackages(): PackageInfo[] {
    return this.workspaceInfo.packages;
  }

  /**
   * 根据名称查找包
   */
  findPackage(packageName: string): PackageInfo | undefined {
    return this.workspaceInfo.packages.find((pkg) => pkg.name === packageName);
  }

  /**
   * 发布包
   */
  async publish(options: PublishOptions): Promise<void> {
    // 确定要发布的包
    let targetPackage: PackageInfo | undefined;

    if (options.packagePath) {
      const resolvedPath = resolve(options.packagePath);
      targetPackage = this.workspaceInfo.packages.find(
        (pkg) => resolve(pkg.path) === resolvedPath
      );
      if (!targetPackage) {
        throw new Error(t("workspace.packageNotFoundByPath", { path: options.packagePath }));
      }
    } else if (this.workspaceInfo.isMonorepo && !options.skipConfirm) {
      throw new Error(t("workspace.monorepoRequiresPath"));
    } else {
      targetPackage = this.workspaceInfo.packages[0];
    }

    if (!targetPackage) {
      throw new Error(t("workspace.packageNotFound"));
    }

    // 确定版本号
    let newVersion: string;
    if (options.version) {
      if (!isValidVersion(options.version)) {
        throw new Error(t("version.invalidWithVersion", { version: options.version }));
      }
      newVersion = options.version;
    } else {
      // 默认 patch 版本
      newVersion = getNextVersion(targetPackage.version, "patch");
    }

    // 确定 changelog
    const changelog = options.changelog || "";

    // 执行脚本（如果指定）
    if (options.script) {
      await runScript(targetPackage, options.script);
    }

    // 构建发布配置
    const config: PublishConfig = {
      package: targetPackage,
      changelog,
      newVersion,
      script: options.script,
      registry: options.registry || process.env.NPM_CONFIG_REGISTRY || "https://registry.npmjs.org/",
      generateChangelog: options.generateChangelog ?? false,
      otp: options.otp,
    };

    // 发布
    await publish(config);
  }
}

/**
 * 导出函数式 API
 */
export async function publishPackage(options: PublishOptions): Promise<void> {
  const npmPush = new NpmPush();
  await npmPush.publish(options);
}

// 导出类型
export type { PublishOptions, PublishConfig, PackageInfo, WorkspaceInfo } from "./types";

// 导出工具函数
export { getWorkspaceInfo } from "./utils/workspace";
export { getNextVersion, isValidVersion } from "./utils/version";
export { getPackageScripts, runScript } from "./utils/scripts";
