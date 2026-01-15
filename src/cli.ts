#!/usr/bin/env bun

/**
 * CLI 入口文件
 * 
 * Copyright (c) 2024 ccode
 * Licensed under the MIT License
 */
import ora from "ora";
import chalk from "chalk";
import { getWorkspaceInfo } from "./utils/workspace";
import {
  selectPackage,
  inputChangelog,
  selectVersion,
  selectScript,
  confirmPushTag,
  confirmRegistry,
  confirmOtp,
  confirmPublish,
  confirmGenerateChangelog,
} from "./prompts";
import { runScript } from "./utils/scripts";
import { generateTag } from "./utils/version";
import { publish } from "./publisher";
import { showLogo, showSuccessMessage } from "./logo";
import type { PublishConfig } from "./types";
import { t } from "./i18n";

/**
 * 主函数
 */
async function main() {
  try {
    // 显示 logo
    showLogo();

    // 获取 workspace 信息
    const workspaceInfo = getWorkspaceInfo();

    // 选择包（如果是 monorepo）
    let selectedPackage;
    if (workspaceInfo.isMonorepo) {
      selectedPackage = await selectPackage(workspaceInfo.packages);
    } else {
      selectedPackage = workspaceInfo.packages[0];
    }

    console.log(
      chalk.green(`\n✅ ${t("package.selectedPackage")}: ${chalk.bold(selectedPackage.name)} (${selectedPackage.version})`)
    );

    // 选择版本（先选择版本，以便生成默认 changelog）
    const { version: newVersion } = await selectVersion(selectedPackage.version);

    // 输入 changelog（传入包信息和版本信息，以便生成默认内容）
    const changelog = await inputChangelog(
      selectedPackage.name,
      selectedPackage.version,
      newVersion
    );

    // 生成 tag
    const tag = generateTag(selectedPackage.name, newVersion);

    // 选择脚本
    const script = await selectScript(selectedPackage);

    // 执行脚本（如果选择了）
    if (script) {
      const spinner = ora(`${t("script.running")}: ${chalk.cyan(script)}`).start();
      try {
        await runScript(selectedPackage, script);
        spinner.succeed(`${t("script.success")}: ${chalk.cyan(script)}`);
      } catch (error) {
        spinner.fail(`${t("script.failed")}: ${chalk.red(script)}`);
        throw error;
      }
    }

    // 确认是否推送 tag
    const pushTag = await confirmPushTag();

    // 确认 registry
    const registry = await confirmRegistry();

    // 确认是否生成 changelog
    const generateChangelog = await confirmGenerateChangelog();

    // 确认是否需要输入 OTP
    const otp = await confirmOtp();

    // 构建发布配置
    const config: PublishConfig = {
      package: selectedPackage,
      changelog,
      newVersion,
      tag,
      script,
      pushTag,
      registry,
      generateChangelog,
      otp,
    };

    // 最终确认
    const confirmed = await confirmPublish(config);
    if (!confirmed) {
      console.log(chalk.yellow(`\n❌ ${t("publish.cancelled")}`));
      process.exit(0);
    }

    // 开始发布
    const publishSpinner = ora(t("publish.publishing")).start();

    try {
      await publish(config);
      publishSpinner.succeed(t("publish.success"));
      
      // 显示成功提示
      showSuccessMessage(selectedPackage.name, newVersion, registry);
    } catch (error) {
      publishSpinner.fail(t("publish.failed"));
      console.error(chalk.red(`\n❌ ${t("publish.error")}:`), error);
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ ${t("publish.generalError")}:`), error);
    process.exit(1);
  }
}

// 运行主函数
main();
