/**
 * Changelog 工具函数测试
 * 支持 CI/CD 环境
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdir, writeFile, rm } from "fs/promises";
import { join } from "path";
import {
  parseChangelog,
  generateChangelogSection,
  readChangelog,
  updateChangelog,
  formatSimpleChangelog,
  type ChangelogEntry,
} from "./changelog";

// 临时测试目录（使用进程 ID 避免并行测试冲突）
const TEST_DIR = join(process.cwd(), `.test-tmp-changelog-${process.pid}`);

describe("Changelog 工具函数", () => {
  beforeEach(async () => {
    // 清理并创建测试目录
    try {
      await rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // 忽略错误
    }
    await mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    // 清理测试目录
    try {
      await rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // 忽略错误
    }
  });

  describe("parseChangelog", () => {
    test("应该解析带类型的 changelog", () => {
      const text = "新增: 添加了新功能\n修复: 修复了 bug";
      const entries = parseChangelog(text);

      expect(entries).toHaveLength(2);
      expect(entries[0].type).toBe("added");
      expect(entries[0].description).toBe("添加了新功能");
      expect(entries[1].type).toBe("fixed");
      expect(entries[1].description).toBe("修复了 bug");
    });

    test("应该解析简单格式的 changelog", () => {
      const text = "- 这是一个新功能\n- 这是另一个功能";
      const entries = parseChangelog(text);

      expect(entries).toHaveLength(2);
      expect(entries[0].type).toBe("added");
      expect(entries[0].description).toBe("这是一个新功能");
    });

    test("应该处理空文本", () => {
      const entries = parseChangelog("");
      expect(entries).toEqual([]);
    });
  });

  describe("generateChangelogSection", () => {
    test("应该生成正确的 changelog 区块", () => {
      const entries: ChangelogEntry[] = [
        { type: "added", description: "新功能" },
        { type: "fixed", description: "修复 bug" },
      ];

      const section = generateChangelogSection("1.0.0", "2024-01-01", entries);

      expect(section).toContain("## [1.0.0] - 2024-01-01");
      expect(section).toContain("### 新增");
      expect(section).toContain("### 修复");
      expect(section).toContain("新功能");
      expect(section).toContain("修复 bug");
    });

    test("应该按类型分组", () => {
      const entries: ChangelogEntry[] = [
        { type: "added", description: "功能1" },
        { type: "added", description: "功能2" },
        { type: "fixed", description: "修复1" },
      ];

      const section = generateChangelogSection("1.0.0", "2024-01-01", entries);

      // 应该有两个新增条目
      const addedCount = (section.match(/新增:/g) || []).length;
      expect(addedCount).toBe(2);

      // 应该有一个修复条目
      const fixedCount = (section.match(/修复:/g) || []).length;
      expect(fixedCount).toBe(1);
    });
  });

  describe("readChangelog", () => {
    test("应该读取现有的 changelog 文件", async () => {
      const content = "# Changelog\n\n## [1.0.0] - 2024-01-01\n\n- 初始版本";
      await writeFile(join(TEST_DIR, "CHANGELOG.md"), content);

      const result = readChangelog(TEST_DIR);

      expect(result).toBe(content);
    });

    test("文件不存在应该返回空字符串", () => {
      const result = readChangelog(TEST_DIR);
      expect(result).toBe("");
    });
  });

  describe("updateChangelog", () => {
    test("应该创建新的 changelog 文件", async () => {
      const changelogText = "新增: 新功能\n修复: 修复 bug";

      updateChangelog(TEST_DIR, "1.0.0", changelogText);

      const content = readChangelog(TEST_DIR);
      expect(content).toContain("# Changelog");
      expect(content).toContain("## [1.0.0]");
      expect(content).toContain("新功能");
      expect(content).toContain("修复 bug");
    });

    test("应该更新现有的 changelog 文件", async () => {
      const existingContent = `# Changelog

## [0.9.0] - 2024-01-01

- 旧版本`;
      await writeFile(join(TEST_DIR, "CHANGELOG.md"), existingContent);

      updateChangelog(TEST_DIR, "1.0.0", "新增: 新功能");

      const content = readChangelog(TEST_DIR);
      expect(content).toContain("## [1.0.0]");
      expect(content).toContain("## [0.9.0]");
      expect(content).toContain("新功能");
    });
  });

  describe("formatSimpleChangelog", () => {
    test("应该将简单文本转换为条目", () => {
      const text = "新功能1\n新功能2";
      const entries = formatSimpleChangelog(text);

      expect(entries).toHaveLength(2);
      expect(entries[0].type).toBe("added");
      expect(entries[0].description).toBe("新功能1");
      expect(entries[1].description).toBe("新功能2");
    });
  });
});
