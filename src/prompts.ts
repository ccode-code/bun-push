/**
 * 交互式命令行提示
 */
import prompts from "prompts";
import chalk from "chalk";
import type { PackageInfo, PublishConfig } from "./types";
import { getNextVersion, RELEASE_TYPES, getReleaseTypeDescription, isValidVersion, type StandardReleaseType } from "./utils/version";
import { getPackageScripts } from "./utils/scripts";
import { t } from "./i18n";

/**
 * 选择要发布的包（monorepo 模式）
 */
export async function selectPackage(packages: PackageInfo[]): Promise<PackageInfo> {
  if (packages.length === 1) {
    return packages[0];
  }

  const { value } = await prompts({
    type: "select",
    name: "value",
    message: t("package.selectPackage"),
    choices: packages.map((pkg) => ({
      title: `${pkg.name} (${pkg.version})`,
      value: pkg,
      description: pkg.path,
    })),
  });

  if (!value) {
    process.exit(0);
  }

  return value;
}

/**
 * 生成默认的 changelog 内容
 */
function generateDefaultChangelog(packageName: string, currentVersion: string, newVersion: string): string {
  return t("changelog.defaultContent", { packageName, currentVersion, newVersion });
}

/**
 * 输入 changelog（单行输入，支持多次输入）
 * 如果用户输入为空或空格，将使用默认的版本升级记录
 */
export async function inputChangelog(
  packageName: string,
  currentVersion: string,
  newVersion: string
): Promise<string> {
  // 使用 Node.js 内置的 readline 模块
  const { createInterface } = await import("readline");
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.cyan(t("changelog.input")));
  console.log(chalk.gray(t("changelog.singleLineHint")));

  const lines: string[] = [];
  let lineNumber = 1;

  return new Promise((resolve) => {
    const promptLine = () => {
      rl.setPrompt(chalk.gray(`[${lineNumber}] `));
      rl.prompt();
    };

    promptLine();

    rl.on("line", (line: string) => {
      const trimmed = line.trim();
      
      // 如果输入为空或空格，且已有内容，结束输入
      if (trimmed === "" && lines.length > 0) {
        rl.close();
        return;
      }
      
      // 如果输入为空或空格，且没有内容，使用默认 changelog
      if (trimmed === "" && lines.length === 0) {
        rl.close();
        return;
      }
      
      // 保存非空行
      if (trimmed !== "") {
        lines.push(trimmed);
        lineNumber++;
        promptLine();
      }
    });

    rl.on("close", () => {
      const result = lines.join("\n").trim();
      
      // 如果结果为空或只有空格，使用默认 changelog
      if (!result) {
        const defaultChangelog = generateDefaultChangelog(packageName, currentVersion, newVersion);
        console.log(chalk.yellow(t("changelog.usingDefault")));
        resolve(defaultChangelog);
        return;
      }

      resolve(result);
    });

    rl.on("SIGINT", () => {
      rl.close();
      process.exit(0);
    });
  });
}

/**
 * 确认是否生成 changelog 文件
 */
export async function confirmGenerateChangelog(): Promise<boolean> {
  const { value } = await prompts({
    type: "confirm",
    name: "value",
    message: t("changelog.generate"),
    initial: true,
  });

  if (value === undefined) {
    process.exit(0);
  }

  return value;
}

/**
 * 选择版本类型并生成版本号
 */
export async function selectVersion(currentVersion: string): Promise<{
  version: string;
  releaseType: string;
}> {
  const choices: Array<{ title: string; value: string; description: string }> = RELEASE_TYPES.map((type) => {
    const nextVersion = getNextVersion(currentVersion, type);
    return {
      title: getReleaseTypeDescription(type),
      value: type,
      description: `${t("version.currentVersion")}: ${chalk.cyan(currentVersion)} → ${t("version.finalVersion")}: ${chalk.bold.green(nextVersion)}`,
    };
  });

  // 添加自定义版本选项
  choices.push({
    title: t("version.customVersion"),
    value: "custom",
    description: t("version.customVersionDesc"),
  });

  const { value: releaseType } = await prompts({
    type: "select",
    name: "value",
    message: `${t("version.currentVersion")}: ${chalk.cyan(currentVersion)} | ${t("version.selectType")}`,
    choices,
  });

  if (!releaseType) {
    process.exit(0);
  }

  if (releaseType === "custom") {
    const { value: customVersion } = await prompts({
      type: "text",
      name: "value",
      message: `${t("version.inputVersion")} ${chalk.gray(`(${t("version.example")}: 1.0.0-beta.1)`)}`,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return t("version.versionEmpty");
        }
        if (!isValidVersion(trimmed)) {
          return t("version.invalidWithVersion", { version: trimmed });
        }
        return true;
      },
    });

    if (!customVersion) {
      process.exit(0);
    }

    const trimmedVersion = customVersion.trim();
    if (!isValidVersion(trimmedVersion)) {
      throw new Error(t("version.invalidWithVersion", { version: trimmedVersion }));
    }

    return {
      version: trimmedVersion,
      releaseType: "custom",
    };
  }

  // 类型守卫：确保 releaseType 是 StandardReleaseType
  if (RELEASE_TYPES.includes(releaseType as StandardReleaseType)) {
    return {
      version: getNextVersion(currentVersion, releaseType as StandardReleaseType),
      releaseType,
    };
  }

  // 如果类型不匹配，抛出错误
  throw new Error(t("version.unsupportedTypeWithType", { type: releaseType }));
}

/**
 * 选择要执行的脚本
 */
export async function selectScript(packageInfo: PackageInfo): Promise<string | undefined> {
  const scripts = getPackageScripts(packageInfo);

  if (scripts.length === 0) {
    // 如果没有 scripts，直接返回 undefined
    return undefined;
  }

  const choices = scripts.map((script) => ({
    title: script,
    value: script,
  }));

  choices.push({
    title: t("common.skip"),
    value: "skip",
  });

  const { value: answer } = await prompts({
    type: "select",
    name: "value",
    message: t("script.select"),
    choices,
  });

  if (!answer) {
    process.exit(0);
  }

  return answer === "skip" ? undefined : answer;
}

/**
 * 确认是否推送 git tag
 */
export async function confirmPushTag(): Promise<boolean> {
  const { value } = await prompts({
    type: "confirm",
    name: "value",
    message: t("git.pushTag"),
    initial: true,
  });

  if (value === undefined) {
    process.exit(0);
  }

  return value;
}

/**
 * 确认是否需要输入 npm OTP
 */
export async function confirmOtp(): Promise<string | undefined> {
  const { value: needOtp } = await prompts({
    type: "confirm",
    name: "value",
    message: t("publish.needOtp"),
    initial: false,
  });

  if (needOtp === undefined) {
    process.exit(0);
  }

  if (!needOtp) {
    return undefined;
  }

  const { value: otp } = await prompts({
    type: "text",
    name: "value",
    message: t("publish.inputOtp"),
    validate: (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) {
        return t("publish.otpEmpty");
      }
      // OTP 通常是 6 位数字
      if (!/^\d{6}$/.test(trimmed)) {
        return t("publish.otpInvalid");
      }
      return true;
    },
  });

  if (!otp) {
    process.exit(0);
  }

  return otp.trim();
}

/**
 * 确认 npm registry 地址
 */
export async function confirmRegistry(): Promise<string> {
  const { value } = await prompts({
    type: "text",
    name: "value",
    message: t("registry.input"),
    initial: process.env.NPM_CONFIG_REGISTRY || 'https://registry.npmjs.org/',
    validate: (input: string) => {
      if (!input.trim()) {
        return t("registry.empty");
      }
      try {
        new URL(input);
        return true;
      } catch {
        return t("registry.invalid");
      }
    },
  });

  if (!value) {
    process.exit(0);
  }

  return value.trim();
}

/**
 * 最终确认发布
 */
export async function confirmPublish(config: PublishConfig): Promise<boolean> {
  console.log(chalk.bold(`\n📦 ${t("publish.preview")}`));
  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.cyan(`${t("publish.packageName")}:`), config.package.name);
  console.log(chalk.cyan(`${t("publish.currentVersion")}:`), config.package.version);
  console.log(chalk.cyan(`${t("publish.newVersion")}:`), config.newVersion);
  console.log(chalk.cyan(`${t("publish.tag")}:`), config.tag);
  console.log(chalk.cyan(`${t("publish.changelog")}:`), config.changelog);
  console.log(chalk.cyan(`${t("publish.registry")}:`), config.registry);
  console.log(chalk.cyan(`${t("publish.pushTag")}:`), config.pushTag ? t("common.yes") : t("common.no"));
  console.log(chalk.cyan(`${t("publish.generateChangelog")}:`), config.generateChangelog ? t("common.yes") : t("common.no"));
  if (config.otp) {
    console.log(chalk.cyan(`${t("publish.otp")}:`), chalk.gray("***"));
  }
  if (config.script) {
    console.log(chalk.cyan(`${t("publish.script")}:`), config.script);
  }
  console.log(chalk.gray("─".repeat(50)));

  const { value } = await prompts({
    type: "confirm",
    name: "value",
    message: t("publish.confirm"),
    initial: true,
  });

  if (value === undefined) {
    process.exit(0);
  }

  return value;
}
