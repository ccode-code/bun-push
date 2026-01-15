/**
 * bun-push logo 和成功提示
 */
import chalk from "chalk";
import figlet from "figlet";
import { t } from "./i18n";

/**
 * 显示 logo
 */
export function showLogo(): void {
  try {
    // 使用 figlet 生成 ASCII art
    const asciiText = figlet.textSync("bun-push", {
      font: "Standard", // 使用标准字体，比较紧凑
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    // 将 ASCII art 按行分割，并为每行添加颜色
    const lines = asciiText.split("\n").filter((line: string) => line.trim().length > 0);
    
    if (lines.length === 0) {
      // 如果 figlet 生成失败，使用简单文本
      console.log(chalk.cyan.bold("\n  bun-push\n"));
      return;
    }

    const coloredLines = lines.map((line: string, index: number) => {
      // 根据位置使用不同颜色
      const midPoint = Math.floor(line.length / 2);
      if (index < lines.length / 2) {
        // 上半部分（bun）使用红色和黄色
        return chalk.red(line.substring(0, midPoint)) + 
               chalk.yellow(line.substring(midPoint));
      } else {
        // 下半部分（push）使用紫色和蓝色
        return chalk.magenta(line.substring(0, midPoint)) + 
               chalk.blue(line.substring(midPoint));
      }
    });

    const logo = "\n" + coloredLines.join("\n") + "\n";
    console.log(logo);
  } catch (error) {
    // 如果 figlet 不可用，使用简单的文本 logo
    console.log(chalk.cyan.bold("\n  bun-push\n"));
  }
}

/**
 * 显示成功提示
 */
export function showSuccessMessage(packageName: string, version: string, registry: string): void {
  console.log(chalk.green.bold(`\n✅ ${t("success.title")}\n`));
  console.log(chalk.gray("─".repeat(60)));
  console.log(chalk.cyan.bold(`📦 ${t("success.packageName")}:`), chalk.white(packageName));
  console.log(chalk.cyan.bold(`🏷️  ${t("success.version")}:`), chalk.white(version));
  console.log(chalk.cyan.bold(`🌐 ${t("success.registry")}:`), chalk.white(registry));
  console.log(chalk.gray("─".repeat(60)));
  console.log(chalk.green(`\n🎉 ${t("success.thanks")}\n`));
}
