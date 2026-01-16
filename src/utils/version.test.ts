/**
 * 版本管理工具函数测试
 */
import { describe, test, expect } from "bun:test";
import {
  getNextVersion,
  isValidVersion,
  getReleaseTypeDescription,
  RELEASE_TYPES,
} from "./version";

describe("版本管理工具函数", () => {
  describe("getNextVersion", () => {
    test("应该正确生成 patch 版本", () => {
      expect(getNextVersion("1.0.0", "patch")).toBe("1.0.1");
      expect(getNextVersion("1.2.3", "patch")).toBe("1.2.4");
    });

    test("应该正确生成 minor 版本", () => {
      expect(getNextVersion("1.0.0", "minor")).toBe("1.1.0");
      expect(getNextVersion("1.2.3", "minor")).toBe("1.3.0");
    });

    test("应该正确生成 major 版本", () => {
      expect(getNextVersion("1.0.0", "major")).toBe("2.0.0");
      expect(getNextVersion("1.2.3", "major")).toBe("2.0.0");
    });

    test("默认应该生成 patch 版本", () => {
      expect(getNextVersion("1.0.0")).toBe("1.0.1");
    });

    test("无效版本号应该抛出错误", () => {
      expect(() => getNextVersion("invalid", "patch")).toThrow("无效的版本号");
      expect(() => getNextVersion("", "patch")).toThrow("无效的版本号");
    });
  });

  describe("isValidVersion", () => {
    test("应该验证有效的版本号", () => {
      expect(isValidVersion("1.0.0")).toBe(true);
      expect(isValidVersion("1.2.3")).toBe(true);
      expect(isValidVersion("0.0.1")).toBe(true);
      expect(isValidVersion("10.20.30")).toBe(true);
    });

    test("应该拒绝无效的版本号", () => {
      expect(isValidVersion("invalid")).toBe(false);
      expect(isValidVersion("1.0")).toBe(false);
      expect(isValidVersion("1")).toBe(false);
      expect(isValidVersion("")).toBe(false);
      expect(isValidVersion("1.0.0.0")).toBe(false);
    });
  });

  describe("getReleaseTypeDescription", () => {
    test("应该返回正确的描述", () => {
      expect(getReleaseTypeDescription("patch")).toContain("补丁版本");
      expect(getReleaseTypeDescription("minor")).toContain("次版本");
      expect(getReleaseTypeDescription("major")).toContain("主版本");
    });

    test("所有发布类型都应该有描述", () => {
      for (const type of RELEASE_TYPES) {
        const description = getReleaseTypeDescription(type);
        expect(description).toBeTruthy();
        expect(typeof description).toBe("string");
      }
    });
  });

  describe("RELEASE_TYPES", () => {
    test("应该包含所有标准发布类型", () => {
      expect(RELEASE_TYPES).toContain("patch");
      expect(RELEASE_TYPES).toContain("minor");
      expect(RELEASE_TYPES).toContain("major");
      expect(RELEASE_TYPES.length).toBe(3);
    });
  });
});
