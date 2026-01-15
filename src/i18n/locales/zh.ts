/**
 * 中文语言包
 */
export default {
  // 通用
  common: {
    yes: "是",
    no: "否",
    skip: "跳过",
    cancel: "取消",
    confirm: "确认",
    error: "错误",
    success: "成功",
  },

  // 包选择
  package: {
    selectPackage: "请选择要发布的包",
    selectedPackage: "已选择包",
  },

  // Changelog
  changelog: {
    input: "请输入 changelog（单行输入，支持多次输入，输入空行结束）",
    singleLineHint: "支持多次单行输入，输入空行结束。如果输入为空，将使用默认的版本升级记录",
    empty: "changelog 不能为空",
    generate: "是否生成 CHANGELOG.md 文件？",
    usingDefault: "使用默认 changelog：版本升级记录",
    defaultContent: "升级版本号: {currentVersion} → {newVersion}",
  },

  // 版本
  version: {
    selectType: "选择版本类型",
    currentVersion: "当前版本",
    finalVersion: "最终版本",
    customVersion: "自定义版本号",
    customVersionDesc: "手动输入版本号",
    inputVersion: "请输入版本号",
    example: "示例",
    versionEmpty: "版本号不能为空",
    patch: "补丁版本 - 修复 bug",
    minor: "次版本 - 新功能，向后兼容",
    major: "主版本 - 破坏性变更",
    invalid: "无效的版本号",
    invalidWithVersion: "无效的版本号: {version}",
    cannotGenerate: "无法生成下一个版本号",
    unsupportedType: "不支持的发布类型",
    unsupportedTypeWithType: "不支持的发布类型: {type}",
    versionFormat: "{current} -> {next}",
  },

  // 脚本
  script: {
    select: "请选择要执行的脚本（通常是 build）",
    noScripts: "该包没有 scripts",
    running: "执行脚本",
    success: "脚本执行成功",
    failed: "脚本执行失败",
    notFound: "脚本不存在",
    notFoundWithName: "脚本 \"{name}\" 不存在",
    executionFailed: "脚本执行失败，退出码: {exitCode}",
  },

  // Git
  git: {
    pushTag: "是否推送 git tag？",
    createTagFailed: "创建 git tag 失败，退出码: {exitCode}",
    pushTagFailed: "推送 git tag 失败，退出码: {exitCode}",
  },

  // Registry
  registry: {
    input: "请输入 npm registry 地址",
    empty: "registry 地址不能为空",
    invalid: "请输入有效的 URL",
  },

  // 发布
  publish: {
    preview: "发布配置预览",
    packageName: "包名",
    currentVersion: "当前版本",
    newVersion: "新版本",
    tag: "Tag",
    changelog: "Changelog",
    registry: "Registry",
    pushTag: "推送 Tag",
    generateChangelog: "生成 Changelog",
    script: "执行脚本",
    confirm: "确认发布？",
    publishing: "正在发布到 npm...",
    success: "发布成功！",
    failed: "发布失败",
    cancelled: "已取消发布",
    error: "发布过程中出现错误",
    generalError: "错误",
    npmPublishFailed: "npm 发布失败，退出码: {exitCode}",
    npmNotLoggedIn: "未登录到 npm registry: {registry}，请先运行 'npm login --registry {registry}' 登录",
    npmAuthCheckFailed: "检查 npm 登录状态失败 (registry: {registry}): {error}",
    needOtp: "是否需要输入 npm 发布的一次性代码（OTP）？",
    inputOtp: "请输入一次性代码（OTP）",
    otpEmpty: "一次性代码不能为空",
    otpInvalid: "一次性代码必须是 6 位数字",
    otp: "一次性代码（OTP）",
    rollingBack: "发布失败，正在回滚修改...",
    rollbackComplete: "回滚完成",
    rollbackFailed: "回滚失败，请手动恢复版本号和 changelog:",
  },

  // 成功消息
  success: {
    title: "发布成功！",
    packageName: "包名",
    version: "版本",
    registry: "Registry",
    thanks: "感谢使用 bun-push！",
  },

  // Changelog 类型
  changelogTypes: {
    added: "新增",
    changed: "变更",
    deprecated: "废弃",
    removed: "移除",
    fixed: "修复",
    security: "安全",
  },

  // Workspace
  workspace: {
    packageJsonNotFound: "未找到 package.json 文件",
    workspacesConfigInvalid: "workspaces 配置无效",
    packageNotFound: "未找到要发布的包",
    packageNotFoundByPath: "未找到路径为 {path} 的包",
    monorepoRequiresPath: "monorepo 模式下必须指定 packagePath 或使用 CLI 模式",
  },
};
