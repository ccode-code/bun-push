# bun-push

<div align="center">

**一个支持 monorepo 和单仓库的 npm 包发布工具，支持 CLI 和 JS API 两种使用方式**

🇨🇳 **中文** | [🇺🇸 English](docs/README.en.md) | [🇯🇵 日本語](docs/README.ja.md) | [🇰🇷 한국어](docs/README.ko.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.3.0+-black?logo=bun)](https://bun.sh)

</div>

---

## ✨ 特性

- 🎯 **支持 Monorepo 和单仓库**：自动检测项目类型，支持 workspace 模式
- 📦 **交互式发布流程**：友好的命令行交互界面
- 🔄 **自动化版本管理**：支持语义化版本（semver）
- 🏷️ **Git Tag 管理**：自动创建和推送 git tag
- 📝 **Changelog 支持**：发布前记录变更日志，自动生成 CHANGELOG.md 文件
- 🛠️ **脚本执行**：支持发布前执行构建脚本（如 build）
- 🎨 **美观的 UI**：带有 loading 动画和成功提示
- 📚 **JS API**：同时提供程序化 API 供 Node.js 脚本使用
- 🌍 **多语言支持**：支持中文、英文、日语、韩语，默认使用中文

## 📦 安装

```bash
# 使用 bun
bun add -g bun-push

# 或使用 npm
npm install -g bun-push

# 或使用 yarn
yarn global add bun-push

# 或使用 pnpm
pnpm add -g bun-push
```

## 🌍 多语言支持

bun-push 支持以下语言：
- 🇨🇳 中文 (Chinese) - **默认语言**
- 🇺🇸 English
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)

### 语言设置

工具默认使用中文。如果需要手动指定语言，可以通过环境变量设置：

```bash
# 设置语言为英文
export BUN_PUSH_LANG=en
bun-push

# 设置语言为日语
export BUN_PUSH_LANG=ja
bun-push

# 设置语言为韩语
export BUN_PUSH_LANG=ko
bun-push

# 设置语言为中文
export BUN_PUSH_LANG=zh
bun-push
```

## 🚀 使用

### CLI 方式

在项目根目录运行：

```bash
bun-push
```

CLI 会引导您完成以下流程：

1. **选择包**（monorepo 模式下）
   - 自动检测 workspace 配置
   - 列出所有可发布的包供选择

2. **填写 Changelog**
   - 输入本次发布的变更说明
   - 支持多行输入，每行一个条目
   - 输入完成后，按 Enter 键（空行）结束输入
   - 支持格式：`新增: 描述`、`修复: 描述`、`变更: 描述` 等
   - 也支持简单格式：`- 描述`

3. **选择版本类型**
   - `patch`：补丁版本 (1.0.0 -> 1.0.1)
   - `minor`：次版本 (1.0.0 -> 1.1.0)
   - `major`：主版本 (1.0.0 -> 2.0.0)
   - `custom`：自定义版本号

4. **选择要执行的脚本**（可选）
   - 通常选择 `build` 脚本进行构建
   - 也可以跳过脚本执行

5. **确认是否推送 Git Tag**
   - 选择是否创建并推送 git tag

6. **确认是否生成 CHANGELOG.md 文件**
   - 选择是否自动生成或更新 CHANGELOG.md 文件
   - 文件遵循 [Keep a Changelog](https://keepachangelog.com/) 格式

7. **确认 npm Registry 地址**
   - 默认使用官方 npm registry
   - 可以切换到其他 registry（如私有 npm）

8. **最终确认**
   - 预览发布配置
   - 确认后开始发布

### JS API 方式

```typescript
import { NpmPush, publishPackage } from "bun-push";

// 方式 1: 使用类
const npmPush = new NpmPush();

// 获取 workspace 信息
const workspaceInfo = npmPush.getWorkspaceInfo();
console.log("是否是 monorepo:", workspaceInfo.isMonorepo);

// 获取所有包
const packages = npmPush.getPackages();
console.log("包列表:", packages.map((pkg) => pkg.name));

// 查找包
const pkg = npmPush.findPackage("my-package");

// 发布包
await npmPush.publish({
  packagePath: "./packages/my-package",
  changelog: "修复: 修复了重要 bug",
  version: "1.0.1",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // 生成 CHANGELOG.md 文件
});

// 方式 2: 使用函数式 API
await publishPackage({
  packagePath: "./packages/my-package",
  changelog: "新增: 新功能\n修复: 修复了 bug",
  version: "1.1.0",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // 生成 CHANGELOG.md 文件
});
```

## 📖 API 文档

### `NpmPush` 类

#### 构造函数

```typescript
new NpmPush(workingDir?: string)
```

- `workingDir`: 工作目录，默认为当前目录

#### 方法

##### `getWorkspaceInfo()`

获取 workspace 信息。

返回类型：`WorkspaceInfo`

##### `getPackages()`

获取所有包列表。

返回类型：`PackageInfo[]`

##### `findPackage(packageName: string)`

根据包名查找包。

参数：
- `packageName`: 包名

返回类型：`PackageInfo | undefined`

##### `publish(options: PublishOptions)`

发布包。

参数：
- `options.packagePath?`: 包路径（monorepo 模式下必填）
- `options.skipConfirm?`: 是否跳过交互式确认
- `options.version?`: 自定义版本号
- `options.changelog?`: changelog 内容
- `options.tag?`: git tag 名称
- `options.script?`: 要执行的脚本
- `options.pushTag?`: 是否推送 git tag
- `options.registry?`: npm registry 地址
- `options.generateChangelog?`: 是否生成 CHANGELOG.md 文件

### `publishPackage(options: PublishOptions)`

发布包的函数式 API。

## 📝 Changelog 格式

bun-push 支持自动生成符合 [Keep a Changelog](https://keepachangelog.com/) 规范的 CHANGELOG.md 文件。

### 支持的格式

1. **带类型的格式**（推荐）：
   ```
   新增: 添加了新功能
   修复: 修复了重要 bug
   变更: 改进了性能
   移除: 移除了废弃的 API
   安全: 修复了安全漏洞
   ```

2. **简单格式**：
   ```
   - 添加了新功能
   - 修复了 bug
   - 改进了性能
   ```

### Changelog 类型

- `新增` / `added`: 新功能
- `变更` / `changed`: 对现有功能的变更
- `废弃` / `deprecated`: 即将移除的功能
- `移除` / `removed`: 已移除的功能
- `修复` / `fixed`: Bug 修复
- `安全` / `security`: 安全相关的修复

生成的 CHANGELOG.md 文件会自动按类型分组，并包含版本号和发布日期。

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/ccode/bun-push.git
cd bun-push

# 安装依赖
bun install

# 开发模式运行
bun run dev

# 构建
bun run build

# 运行测试
bun test

# 运行测试并查看覆盖率
bun test --coverage
```

## 📝 要求

- Bun >= 1.1.0
- TypeScript 5.7+

> 注意：这是一个完全的 Bun 项目，使用 Bun 的原生类型系统，不依赖 Node.js 类型定义。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

更多信息请参阅 [贡献指南](docs/.github/CONTRIBUTING.zh.md)。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

完整的许可证文本请参阅 [LICENSE](LICENSE) 文件。更多法律相关信息，请参阅 [LEGAL.zh.md](docs/LEGAL.zh.md)。

---

## 📚 其他语言文档

选择您的语言：

- 🇨🇳 **中文**（当前页面）
- 🇺🇸 [English](docs/README.en.md)
- 🇯🇵 [日本語ドキュメント](docs/README.ja.md)
- 🇰🇷 [한국어 문서](docs/README.ko.md)

## ⚖️ 法律声明

- [法律声明 (中文)](docs/LEGAL.zh.md)
- [Legal Notice (English)](docs/LEGAL.en.md)
- [法律声明 (日本語)](docs/LEGAL.ja.md)
- [법적 고지 (한국어)](docs/LEGAL.ko.md)

## 🤝 贡献指南

- [贡献指南 (中文)](docs/.github/CONTRIBUTING.zh.md)
- [Contributing Guide (English)](docs/.github/CONTRIBUTING.en.md)
- [貢献ガイド (日本語)](docs/.github/CONTRIBUTING.ja.md)
- [기여 가이드 (한국어)](docs/.github/CONTRIBUTING.ko.md)

---

Copyright (c) 2024 ccode
