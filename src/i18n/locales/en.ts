/**
 * English language pack
 */
export default {
  // Common
  common: {
    yes: "Yes",
    no: "No",
    skip: "Skip",
    cancel: "Cancel",
    confirm: "Confirm",
    error: "Error",
    success: "Success",
  },

  // Package selection
  package: {
    selectPackage: "Select package to publish",
    selectedPackage: "Selected package",
  },

  // Changelog
  changelog: {
    input: "Enter changelog (single line input, supports multiple inputs, press Enter to finish)",
    singleLineHint: "Supports multiple single-line inputs, press Enter to finish. If input is empty, default version upgrade record will be used",
    empty: "changelog cannot be empty",
    generate: "Generate CHANGELOG.md file?",
    usingDefault: "Using default changelog: version upgrade record",
    defaultContent: "Upgrade version: {currentVersion} → {newVersion}",
  },

  // Version
  version: {
    selectType: "Select version type",
    currentVersion: "Current version",
    finalVersion: "Final version",
    customVersion: "Custom version",
    customVersionDesc: "Enter version manually",
    inputVersion: "Enter version number",
    example: "Example",
    versionEmpty: "Version cannot be empty",
    patch: "Patch version - Bug fixes",
    minor: "Minor version - New features, backward compatible",
    major: "Major version - Breaking changes",
    invalid: "Invalid version number",
    invalidWithVersion: "Invalid version number: {version}",
    cannotGenerate: "Cannot generate next version",
    unsupportedType: "Unsupported release type",
    unsupportedTypeWithType: "Unsupported release type: {type}",
    versionFormat: "{current} -> {next}",
  },

  // Script
  script: {
    select: "Select script to run (usually build)",
    noScripts: "This package has no scripts",
    running: "Running script",
    success: "Script executed successfully",
    failed: "Script execution failed",
    notFound: "Script not found",
    notFoundWithName: "Script \"{name}\" not found",
    executionFailed: "Script execution failed, exit code: {exitCode}",
  },

  // Git
  git: {
    pushTag: "Push git tag?",
    createTagFailed: "Failed to create git tag, exit code: {exitCode}",
    pushTagFailed: "Failed to push git tag, exit code: {exitCode}",
  },

  // Registry
  registry: {
    input: "Enter npm registry address",
    empty: "Registry address cannot be empty",
    invalid: "Please enter a valid URL",
  },

  // Publish
  publish: {
    preview: "Publish configuration preview",
    packageName: "Package name",
    currentVersion: "Current version",
    newVersion: "New version",
    tag: "Tag",
    changelog: "Changelog",
    registry: "Registry",
    pushTag: "Push Tag",
    generateChangelog: "Generate Changelog",
    script: "Script",
    confirm: "Confirm publish?",
    publishing: "Publishing to npm...",
    success: "Published successfully!",
    failed: "Publish failed",
    cancelled: "Publish cancelled",
    error: "Error during publish",
    generalError: "Error",
    npmPublishFailed: "npm publish failed, exit code: {exitCode}",
    npmNotLoggedIn: "Not logged in to npm registry: {registry}, please run 'npm login --registry {registry}' first",
    npmAuthCheckFailed: "Failed to check npm login status (registry: {registry}): {error}",
    needOtp: "Do you need to enter npm publish one-time code (OTP)?",
    inputOtp: "Enter one-time code (OTP)",
    otpEmpty: "One-time code cannot be empty",
    otpInvalid: "One-time code must be 6 digits",
    otp: "One-time code (OTP)",
    rollingBack: "Publish failed, rolling back changes...",
    rollbackComplete: "Rollback completed",
    rollbackFailed: "Rollback failed, please manually restore version and changelog:",
  },

  // Success message
  success: {
    title: "Published successfully!",
    packageName: "Package name",
    version: "Version",
    registry: "Registry",
    thanks: "Thanks for using bun-push!",
  },

  // Changelog types
  changelogTypes: {
    added: "Added",
    changed: "Changed",
    deprecated: "Deprecated",
    removed: "Removed",
    fixed: "Fixed",
    security: "Security",
  },

  // Workspace
  workspace: {
    packageJsonNotFound: "package.json file not found",
    workspacesConfigInvalid: "workspaces configuration is invalid",
    packageNotFound: "Package not found",
    packageNotFoundByPath: "Package not found at path: {path}",
    monorepoRequiresPath: "In monorepo mode, packagePath must be specified or use CLI mode",
  },
};
