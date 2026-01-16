/**
 * 项目类型定义
 */

/**
 * 包信息
 */
export interface PackageInfo {
  /** 包名 */
  name: string;
  /** 包版本 */
  version: string;
  /** 包路径 */
  path: string;
  /** package.json 完整内容 */
  packageJson: Record<string, any>;
}

/**
 * Workspace 信息
 */
export interface WorkspaceInfo {
  /** 是否是 monorepo */
  isMonorepo: boolean;
  /** 所有工作空间的包 */
  packages: PackageInfo[];
  /** 根目录 package.json */
  rootPackageJson: Record<string, any>;
  /** 根目录路径 */
  rootPath: string;
}

/**
 * 发布配置
 */
export interface PublishConfig {
  /** 选择的包 */
  package: PackageInfo;
  /** changelog 内容 */
  changelog: string;
  /** 新版本号 */
  newVersion: string;
  /** 需要执行的脚本 */
  script?: string;
  /** npm registry 地址 */
  registry: string;
  /** 是否生成 changelog 文件 */
  generateChangelog?: boolean;
  /** npm 发布的一次性代码（OTP） */
  otp?: string;
}

/**
 * 发布选项
 */
export interface PublishOptions {
  /** 包路径（可选，用于单仓库） */
  packagePath?: string;
  /** 是否跳过交互式确认 */
  skipConfirm?: boolean;
  /** 自定义版本号（跳过交互） */
  version?: string;
  /** 自定义 changelog（跳过交互） */
  changelog?: string;
  /** 要执行的脚本 */
  script?: string;
  /** npm registry 地址 */
  registry?: string;
  /** 是否生成 changelog 文件 */
  generateChangelog?: boolean;
  /** npm 发布的一次性代码（OTP） */
  otp?: string;
}
