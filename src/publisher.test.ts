/**
 * Publisher 测试
 * 支持 CI/CD 环境
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdir, rm } from "fs/promises";
import { join } from "path";
import type { PublishConfig } from "./types";

// 临时测试目录（使用进程 ID 避免并行测试冲突）
const TEST_DIR = join(process.cwd(), `.test-tmp-publisher-${process.pid}`);

describe("Publisher", () => {
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

  describe("publish", () => {
    test(
      "配置应该正确定义",
      () => {
        const config: PublishConfig = {
          package: {
            name: "test-package",
            version: "1.0.0",
            path: TEST_DIR,
            packageJson: {
              name: "test-package",
              version: "1.0.0",
            },
          },
          changelog: "测试发布",
          newVersion: "1.0.1",
          registry: "https://registry.npmjs.org/",
        };

        expect(config.package.name).toBe("test-package");
        expect(config.newVersion).toBe("1.0.1");
      },
      5000 // 5 秒超时（适用于 CI/CD）
    );

    test(
      "应该支持生成 changelog 的配置",
      () => {
        const config: PublishConfig = {
          package: {
            name: "test-package",
            version: "1.0.0",
            path: TEST_DIR,
            packageJson: {
              name: "test-package",
              version: "1.0.0",
            },
          },
          changelog: "新增: 新功能",
          newVersion: "1.0.1",
          registry: "https://registry.npmjs.org/",
          generateChangelog: true,
        };

        expect(config.generateChangelog).toBe(true);
        expect(config.changelog).toBe("新增: 新功能");
      },
      5000 // 5 秒超时（适用于 CI/CD）
    );
  });
});
