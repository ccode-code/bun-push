/**
 * 版本管理相关工具函数
 */
import semver from "semver";
import { t } from "../i18n";

/**
 * 可用的发布类型（仅支持标准版本）
 */
export type StandardReleaseType = "patch" | "minor" | "major";
export const RELEASE_TYPES: StandardReleaseType[] = ["patch", "minor", "major"];

/**
 * 生成下一个版本号
 */
export function getNextVersion(
  currentVersion: string,
  releaseType: StandardReleaseType = "patch"
): string {
  if (!semver.valid(currentVersion)) {
    throw new Error(t("version.invalidWithVersion", { version: currentVersion }));
  }

  const nextVersion = semver.inc(currentVersion, releaseType);
  if (!nextVersion) {
    throw new Error(t("version.cannotGenerate"));
  }

  return nextVersion;
}

/**
 * 验证版本号格式
 * 只接受标准的语义化版本号格式：major.minor.patch
 * 不接受预发布版本（如 1.0.0-alpha）和构建元数据（如 1.0.0+20130313）
 */
export function isValidVersion(version: string): boolean {
  // 首先检查是否为空
  if (!version || typeof version !== "string") {
    return false;
  }

  const trimmed = version.trim();
  if (!trimmed) {
    return false;
  }

  // 使用正则表达式验证：必须是三个数字，用点分隔，不包含其他字符
  // 格式：major.minor.patch，其中 major、minor、patch 都是非负整数
  const standardVersionPattern = /^\d+\.\d+\.\d+$/;
  if (!standardVersionPattern.test(trimmed)) {
    return false;
  }

  // 使用 semver.valid 进行二次验证，确保版本号有效
  // 如果 semver.valid 返回 null，说明版本号无效（如数字超出范围）
  const valid = semver.valid(trimmed);
  if (!valid) {
    return false;
  }

  // 确保 semver.valid 返回的版本号与输入的版本号完全一致
  // 这样可以排除预发布版本和构建元数据的情况
  // 例如："1.0.0-alpha" 会被 semver.valid 规范化为 "1.0.0-alpha"，但输入是 "1.0.0-alpha"
  // 而 "1.0.0" 会被规范化为 "1.0.0"，输入也是 "1.0.0"，所以应该相等
  // 但如果输入包含预发布或构建元数据，semver.valid 可能返回不同的值
  return valid === trimmed;
}

/**
 * 获取发布类型的描述
 */
export function getReleaseTypeDescription(type: StandardReleaseType): string {
  const descriptions: Record<StandardReleaseType, string> = {
    patch: t("version.patch"),
    minor: t("version.minor"),
    major: t("version.major"),
  };
  return descriptions[type];
}
