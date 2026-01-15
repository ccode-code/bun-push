/**
 * 国际化模块
 */
import zh from "./locales/zh";
import en from "./locales/en";
import ja from "./locales/ja";
import ko from "./locales/ko";

export type Language = "zh" | "en" | "ja" | "ko";

export const SUPPORTED_LANGUAGES: Language[] = ["zh", "en", "ja", "ko"];

const translations = {
  zh,
  en,
  ja,
  ko,
};

let currentLanguage: Language = "zh";

/**
 * 检测系统语言
 */
function detectLanguage(): Language {
  // 优先从环境变量获取
  const envLang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES || "";
  
  // 从环境变量解析语言代码
  if (envLang) {
    // 支持格式: zh_CN.UTF-8, zh-CN.UTF-8, zh_CN, zh-CN 等
    const langMatch = envLang.match(/(?:^|_|-)(zh|en|ja|ko)(?:[._-]|$)/i);
    if (langMatch) {
      const lang = langMatch[1].toLowerCase() as Language;
      if (SUPPORTED_LANGUAGES.includes(lang)) {
        return lang;
      }
    }
  }
  
  // 从系统 locale 获取（使用 Intl API）
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const lang = locale.split("-")[0].toLowerCase() as Language;
    
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang;
    }
  } catch {
    // 忽略错误
  }

  // 尝试从 Intl.Collator 获取
  try {
    const collator = new Intl.Collator();
    const locale = collator.resolvedOptions().locale;
    const lang = locale.split("-")[0].toLowerCase() as Language;
    
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang;
    }
  } catch {
    // 忽略错误
  }

  // 默认返回中文
  return "zh";
}

/**
 * 设置语言
 */
export function setLanguage(lang: Language): void {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    currentLanguage = lang;
  }
}

/**
 * 获取当前语言
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * 初始化语言（自动检测）
 */
export function initLanguage(): void {
  // 优先检查环境变量
  const envLang = process.env.BUN_PUSH_LANG as Language | undefined;
  if (envLang && SUPPORTED_LANGUAGES.includes(envLang)) {
    currentLanguage = envLang;
    return;
  }

  // 自动检测系统语言
  currentLanguage = detectLanguage();
}

/**
 * 翻译函数
 * @param key 翻译键
 * @param params 参数对象，用于替换占位符 {key}
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: any = translations[currentLanguage];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // 如果当前语言找不到，尝试使用中文
      if (currentLanguage !== "zh") {
        value = translations.zh;
        for (const k2 of keys) {
          if (value && typeof value === "object" && k2 in value) {
            value = value[k2];
          } else {
            return key; // 如果都找不到，返回 key
          }
        }
      } else {
        return key; // 如果都找不到，返回 key
      }
    }
  }

  let result = typeof value === "string" ? value : key;

  // 替换参数占位符
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue));
    }
  }

  return result;
}

// 初始化语言
initLanguage();
