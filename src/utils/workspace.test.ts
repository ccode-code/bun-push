/**
 * Workspace 工具函数测试
 * 支持 CI/CD 环境
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdir, writeFile, rm } from "fs/promises";
import { join } from "path";
import { getWorkspaceInfo, findPackageByName, findPackageByPath } from "./workspace";

// 临时测试目录（使用进程 ID 避免并行测试冲突）
const TEST_DIR = join(process.cwd(), `.test-tmp-${process.pid}`);

describe("Workspace 工具函数", () => {
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

  describe("getWorkspaceInfo - 单仓库项目", () => {
    test("应该正确识别单仓库项目", async () => {
      const packageJson = {
        name: "test-package",
        version: "1.0.0",
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);

      expect(workspaceInfo.isMonorepo).toBe(false);
      expect(workspaceInfo.packages).toHaveLength(1);
      expect(workspaceInfo.packages[0].name).toBe("test-package");
      expect(workspaceInfo.packages[0].version).toBe("1.0.0");
    });

    test("没有 package.json 应该抛出错误", () => {
      expect(() => getWorkspaceInfo(join(TEST_DIR, "nonexistent"))).toThrow(
        "未找到 package.json"
      );
    });
  });

  describe("getWorkspaceInfo - Monorepo 项目", () => {
    test("应该正确识别数组格式的 workspaces", async () => {
      const rootPackageJson = {
        name: "root",
        version: "1.0.0",
        workspaces: ["packages/*"],
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(rootPackageJson, null, 2)
      );

      // 创建子包目录
      const packagesDir = join(TEST_DIR, "packages");
      await mkdir(packagesDir, { recursive: true });

      const pkg1Dir = join(packagesDir, "pkg1");
      await mkdir(pkg1Dir, { recursive: true });
      await writeFile(
        join(pkg1Dir, "package.json"),
        JSON.stringify({ name: "pkg1", version: "1.0.0" }, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);

      expect(workspaceInfo.isMonorepo).toBe(true);
      expect(workspaceInfo.packages.length).toBeGreaterThanOrEqual(1);
    });

    test("应该正确识别对象格式的 workspaces", async () => {
      const rootPackageJson = {
        name: "root",
        version: "1.0.0",
        workspaces: {
          packages: ["packages/*"],
        },
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(rootPackageJson, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);

      expect(workspaceInfo.isMonorepo).toBe(true);
    });
  });

  describe("findPackageByName", () => {
    test("应该根据包名查找包", async () => {
      const packageJson = {
        name: "test-package",
        version: "1.0.0",
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);
      const found = findPackageByName(workspaceInfo, "test-package");

      expect(found).toBeDefined();
      expect(found?.name).toBe("test-package");
    });

    test("找不到包应该返回 undefined", async () => {
      const packageJson = {
        name: "test-package",
        version: "1.0.0",
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);
      const found = findPackageByName(workspaceInfo, "nonexistent");

      expect(found).toBeUndefined();
    });
  });

  describe("findPackageByPath", () => {
    test("应该根据路径查找包", async () => {
      const packageJson = {
        name: "test-package",
        version: "1.0.0",
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);
      const found = findPackageByPath(workspaceInfo, TEST_DIR);

      expect(found).toBeDefined();
      expect(found?.name).toBe("test-package");
    });

    test("找不到路径应该返回 undefined", async () => {
      const packageJson = {
        name: "test-package",
        version: "1.0.0",
      };

      await writeFile(
        join(TEST_DIR, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );

      const workspaceInfo = getWorkspaceInfo(TEST_DIR);
      const found = findPackageByPath(workspaceInfo, "/nonexistent/path");

      expect(found).toBeUndefined();
    });
  });
});
