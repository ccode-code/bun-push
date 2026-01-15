# bun-push

<div align="center">

**An npm package publishing tool that supports both monorepo and single repository projects, with both CLI and JS API usage**

[🇨🇳 中文](../README.md) | 🇺🇸 **English** | [🇯🇵 日本語](README.ja.md) | [🇰🇷 한국어](README.ko.md)

</div>

---

## ✨ Features

- 🎯 **Monorepo and Single Repository Support**: Automatically detects project type, supports workspace mode
- 📦 **Interactive Publishing Process**: User-friendly command-line interface
- 🔄 **Automated Version Management**: Supports semantic versioning (semver)
- 🏷️ **Git Tag Management**: Automatically creates and pushes git tags
- 📝 **Changelog Support**: Records change logs before publishing, automatically generates CHANGELOG.md files
- 🛠️ **Script Execution**: Supports executing build scripts (like build) before publishing
- 🎨 **Beautiful UI**: Includes loading animations and success notifications
- 📚 **JS API**: Provides programmatic API for Node.js scripts
- 🌍 **Multi-language Support**: Supports Chinese, English, Japanese, and Korean, defaults to Chinese

## 📦 Installation

```bash
# Using bun
bun add -g bun-push

# Or using npm
npm install -g bun-push

# Or using yarn
yarn global add bun-push

# Or using pnpm
pnpm add -g bun-push
```

## 🌍 Multi-language Support

bun-push supports the following languages:
- 🇨🇳 Chinese - **Default language**
- 🇺🇸 English
- 🇯🇵 Japanese
- 🇰🇷 Korean

### Language Settings

The tool defaults to Chinese. To manually specify a language, use environment variables:

```bash
# Set language to English
export BUN_PUSH_LANG=en
bun-push

# Set language to Japanese
export BUN_PUSH_LANG=ja
bun-push

# Set language to Korean
export BUN_PUSH_LANG=ko
bun-push

# Set language to Chinese
export BUN_PUSH_LANG=zh
bun-push
```

## 🚀 Usage

### CLI Mode

Run in the project root directory:

```bash
bun-push
```

The CLI will guide you through the following process:

1. **Select Package** (in monorepo mode)
   - Automatically detects workspace configuration
   - Lists all publishable packages for selection

2. **Enter Changelog**
   - Enter change descriptions for this release
   - Supports multi-line input, one entry per line
   - Press Enter (empty line) to finish input
   - Supports formats: `Added: description`, `Fixed: description`, `Changed: description`, etc.
   - Also supports simple format: `- description`

3. **Select Version Type**
   - `patch`: Patch version (1.0.0 -> 1.0.1)
   - `minor`: Minor version (1.0.0 -> 1.1.0)
   - `major`: Major version (1.0.0 -> 2.0.0)
   - `custom`: Custom version number

4. **Select Script to Execute** (optional)
   - Usually select `build` script for building
   - Can also skip script execution

5. **Confirm Git Tag Push**
   - Choose whether to create and push git tag

6. **Confirm CHANGELOG.md Generation**
   - Choose whether to automatically generate or update CHANGELOG.md file
   - File follows [Keep a Changelog](https://keepachangelog.com/) format

7. **Confirm npm Registry Address**
   - Defaults to official npm registry
   - Can switch to other registries (such as private npm)

8. **Final Confirmation**
   - Preview publish configuration
   - Start publishing after confirmation

### JS API Mode

```typescript
import { NpmPush, publishPackage } from "bun-push";

// Method 1: Using class
const npmPush = new NpmPush();

// Get workspace info
const workspaceInfo = npmPush.getWorkspaceInfo();
console.log("Is monorepo:", workspaceInfo.isMonorepo);

// Get all packages
const packages = npmPush.getPackages();
console.log("Package list:", packages.map((pkg) => pkg.name));

// Find package
const pkg = npmPush.findPackage("my-package");

// Publish package
await npmPush.publish({
  packagePath: "./packages/my-package",
  changelog: "Fixed: Fixed critical bug",
  version: "1.0.1",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // Generate CHANGELOG.md file
});

// Method 2: Using functional API
await publishPackage({
  packagePath: "./packages/my-package",
  changelog: "Added: New feature\nFixed: Fixed bug",
  version: "1.1.0",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // Generate CHANGELOG.md file
});
```

## 📖 API Documentation

### `NpmPush` Class

#### Constructor

```typescript
new NpmPush(workingDir?: string)
```

- `workingDir`: Working directory, defaults to current directory

#### Methods

##### `getWorkspaceInfo()`

Get workspace information.

Returns: `WorkspaceInfo`

##### `getPackages()`

Get all package list.

Returns: `PackageInfo[]`

##### `findPackage(packageName: string)`

Find package by name.

Parameters:
- `packageName`: Package name

Returns: `PackageInfo | undefined`

##### `publish(options: PublishOptions)`

Publish package.

Parameters:
- `options.packagePath?`: Package path (required in monorepo mode)
- `options.skipConfirm?`: Whether to skip interactive confirmation
- `options.version?`: Custom version number
- `options.changelog?`: Changelog content
- `options.tag?`: Git tag name
- `options.script?`: Script to execute
- `options.pushTag?`: Whether to push git tag
- `options.registry?`: npm registry address
- `options.generateChangelog?`: Whether to generate CHANGELOG.md file

### `publishPackage(options: PublishOptions)`

Functional API for publishing packages.

## 📝 Changelog Format

bun-push supports automatically generating CHANGELOG.md files that comply with [Keep a Changelog](https://keepachangelog.com/) standards.

### Supported Formats

1. **Typed Format** (Recommended):
   ```
   Added: Added new feature
   Fixed: Fixed critical bug
   Changed: Improved performance
   Removed: Removed deprecated API
   Security: Fixed security vulnerability
   ```

2. **Simple Format**:
   ```
   - Added new feature
   - Fixed bug
   - Improved performance
   ```

### Changelog Types

- `Added`: New features
- `Changed`: Changes to existing features
- `Deprecated`: Features that will be removed
- `Removed`: Removed features
- `Fixed`: Bug fixes
- `Security`: Security-related fixes

The generated CHANGELOG.md file will automatically group by type and include version numbers and release dates.

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/ccode/bun-push.git
cd bun-push

# Install dependencies
bun install

# Run in development mode
bun run dev

# Build
bun run build

# Run tests
bun test

# Run tests with coverage
bun test --coverage
```

## 📝 Requirements

- Bun >= 1.1.0
- TypeScript 5.7+

> Note: This is a complete Bun project using Bun's native type system, not dependent on Node.js type definitions.

## 🤝 Contributing

Issues and Pull Requests are welcome!

For more information, see [Contributing Guide](.github/CONTRIBUTING.en.md).

## 📄 License

This project is licensed under the [MIT License](../LICENSE).

For the complete license text, please see the [LICENSE](../LICENSE) file. For more legal information, please see [LEGAL.en.md](LEGAL.en.md).

---

## 📚 Other Language Documentation

Choose your language:

- 🇨🇳 [中文文档](../README.md) (default)
- 🇺🇸 **English** (current page)
- 🇯🇵 [日本語ドキュメント](README.ja.md)
- 🇰🇷 [한국어 문서](README.ko.md)

## ⚖️ Legal

- [法律声明 (中文)](LEGAL.zh.md)
- [Legal Notice (English)](LEGAL.en.md)
- [法律声明 (日本語)](LEGAL.ja.md)
- [법적 고지 (한국어)](LEGAL.ko.md)

## 🤝 Contributing Guides

- [贡献指南 (中文)](.github/CONTRIBUTING.zh.md)
- [Contributing Guide (English)](.github/CONTRIBUTING.en.md)
- [貢献ガイド (日本語)](.github/CONTRIBUTING.ja.md)
- [기여 가이드 (한국어)](.github/CONTRIBUTING.ko.md)

---

Copyright (c) 2024 ccode
