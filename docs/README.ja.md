# bun-push

<div align="center">

**monorepo と単一リポジトリの両方をサポートする npm パッケージ公開ツールで、CLI と JS API の両方の使用をサポートします**

[🇨🇳 中文](../README.md) | [🇺🇸 English](README.en.md) | 🇯🇵 **日本語** | [🇰🇷 한국어](README.ko.md)

</div>

---

## ✨ 機能

- 🎯 **Monorepo と単一リポジトリのサポート**：プロジェクトタイプを自動検出、workspace モードをサポート
- 📦 **インタラクティブな公開プロセス**：使いやすいコマンドラインインターフェース
- 🔄 **自動バージョン管理**：セマンティックバージョニング（semver）をサポート
- 🏷️ **Git Tag 管理**：git tag を自動的に作成してプッシュ
- 📝 **Changelog サポート**：公開前に変更ログを記録し、CHANGELOG.md ファイルを自動生成
- 🛠️ **スクリプト実行**：公開前にビルドスクリプト（build など）を実行することをサポート
- 🎨 **美しい UI**：ローディングアニメーションと成功通知を含む
- 📚 **JS API**：Node.js スクリプト用のプログラム API を提供
- 🌍 **多言語サポート**：中国語、英語、日本語、韓国語をサポートし、システム言語を自動検出

## 📦 インストール

```bash
# bun を使用
bun add -g bun-push

# または npm を使用
npm install -g bun-push

# または yarn を使用
yarn global add bun-push

# または pnpm を使用
pnpm add -g bun-push
```

## 🌍 多言語サポート

bun-push は以下の言語をサポートします：
- 🇨🇳 中国語
- 🇺🇸 英語
- 🇯🇵 日本語
- 🇰🇷 韓国語

### 言語設定

ツールはシステム言語を自動検出します。言語を手動で指定する場合は、環境変数を使用します：

```bash
# 言語を英語に設定
export BUN_PUSH_LANG=en
bun-push

# 言語を日本語に設定
export BUN_PUSH_LANG=ja
bun-push

# 言語を韓国語に設定
export BUN_PUSH_LANG=ko
bun-push

# 言語を中国語に設定
export BUN_PUSH_LANG=zh
bun-push
```

## 🚀 使用方法

### CLI モード

プロジェクトのルートディレクトリで実行：

```bash
bun-push
```

CLI は以下のプロセスを案内します：

1. **パッケージの選択**（monorepo モードの場合）
   - workspace 設定を自動検出
   - 公開可能なすべてのパッケージをリスト表示

2. **Changelog の入力**
   - このリリースの変更説明を入力
   - 複数行入力に対応、1行に1エントリ
   - 形式：`追加: 説明`、`修正: 説明`、`変更: 説明` など
   - シンプルな形式もサポート：`- 説明`

3. **バージョンタイプの選択**
   - `patch`：パッチバージョン (1.0.0 -> 1.0.1)
   - `minor`：マイナーバージョン (1.0.0 -> 1.1.0)
   - `major`：メジャーバージョン (1.0.0 -> 2.0.0)
   - `custom`：カスタムバージョン番号

4. **実行するスクリプトの選択**（オプション）
   - 通常は `build` スクリプトを選択してビルド
   - スクリプト実行をスキップすることも可能

5. **Git Tag のプッシュ確認**
   - git tag を作成してプッシュするかどうかを選択

6. **CHANGELOG.md ファイルの生成確認**
   - CHANGELOG.md ファイルを自動生成または更新するかどうかを選択
   - ファイルは [Keep a Changelog](https://keepachangelog.com/) 形式に準拠

7. **npm Registry アドレスの確認**
   - デフォルトは公式 npm registry
   - 他の registry（プライベート npm など）に切り替え可能

8. **最終確認**
   - 公開設定をプレビュー
   - 確認後に公開を開始

### JS API モード

```typescript
import { NpmPush, publishPackage } from "bun-push";

// 方法 1: クラスを使用
const npmPush = new NpmPush();

// workspace 情報を取得
const workspaceInfo = npmPush.getWorkspaceInfo();
console.log("monorepo かどうか:", workspaceInfo.isMonorepo);

// すべてのパッケージを取得
const packages = npmPush.getPackages();
console.log("パッケージリスト:", packages.map((pkg) => pkg.name));

// パッケージを検索
const pkg = npmPush.findPackage("my-package");

// パッケージを公開
await npmPush.publish({
  packagePath: "./packages/my-package",
  changelog: "修正: 重要なバグを修正",
  version: "1.0.1",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // CHANGELOG.md ファイルを生成
});

// 方法 2: 関数型 API を使用
await publishPackage({
  packagePath: "./packages/my-package",
  changelog: "追加: 新機能\n修正: バグを修正",
  version: "1.1.0",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // CHANGELOG.md ファイルを生成
});
```

## 📖 API ドキュメント

### `NpmPush` クラス

#### コンストラクタ

```typescript
new NpmPush(workingDir?: string)
```

- `workingDir`: 作業ディレクトリ、デフォルトは現在のディレクトリ

#### メソッド

##### `getWorkspaceInfo()`

workspace 情報を取得します。

戻り値：`WorkspaceInfo`

##### `getPackages()`

すべてのパッケージリストを取得します。

戻り値：`PackageInfo[]`

##### `findPackage(packageName: string)`

パッケージ名でパッケージを検索します。

パラメータ：
- `packageName`: パッケージ名

戻り値：`PackageInfo | undefined`

##### `publish(options: PublishOptions)`

パッケージを公開します。

パラメータ：
- `options.packagePath?`: パッケージパス（monorepo モードでは必須）
- `options.skipConfirm?`: インタラクティブ確認をスキップするかどうか
- `options.version?`: カスタムバージョン番号
- `options.changelog?`: changelog 内容
- `options.tag?`: git tag 名
- `options.script?`: 実行するスクリプト
- `options.pushTag?`: git tag をプッシュするかどうか
- `options.registry?`: npm registry アドレス
- `options.generateChangelog?`: CHANGELOG.md ファイルを生成するかどうか

### `publishPackage(options: PublishOptions)`

パッケージを公開する関数型 API。

## 📝 Changelog 形式

bun-push は [Keep a Changelog](https://keepachangelog.com/) 標準に準拠した CHANGELOG.md ファイルの自動生成をサポートします。

### サポートされている形式

1. **型付き形式**（推奨）：
   ```
   追加: 新機能を追加
   修正: 重要なバグを修正
   変更: パフォーマンスを改善
   削除: 非推奨の API を削除
   セキュリティ: セキュリティの脆弱性を修正
   ```

2. **シンプルな形式**：
   ```
   - 新機能を追加
   - バグを修正
   - パフォーマンスを改善
   ```

### Changelog タイプ

- `追加` / `added`: 新機能
- `変更` / `changed`: 既存機能への変更
- `非推奨` / `deprecated`: 削除予定の機能
- `削除` / `removed`: 削除された機能
- `修正` / `fixed`: バグ修正
- `セキュリティ` / `security`: セキュリティ関連の修正

生成された CHANGELOG.md ファイルは自動的にタイプごとにグループ化され、バージョン番号とリリース日が含まれます。

## 🛠️ 開発

```bash
# リポジトリをクローン
git clone https://github.com/ccode/bun-push.git
cd bun-push

# 依存関係をインストール
bun install

# 開発モードで実行
bun run dev

# ビルド
bun run build

# テストを実行
bun test

# カバレッジ付きでテストを実行
bun test --coverage
```

## 📝 要件

- Bun >= 1.1.0
- TypeScript 5.7+

> 注意：これは完全な Bun プロジェクトで、Bun のネイティブ型システムを使用し、Node.js の型定義に依存しません。

## 🤝 貢献

Issue と Pull Request を歓迎します！

詳細については、[貢献ガイド](.github/CONTRIBUTING.ja.md) を参照してください。

## 📄 ライセンス

このプロジェクトは [MIT License](../LICENSE) の下でライセンスされています。

完全なライセンステキストについては、[LICENSE](../LICENSE) ファイルを参照してください。より詳細な法的情報については、[LEGAL.ja.md](LEGAL.ja.md) を参照してください。

Copyright (c) 2024 ccode
