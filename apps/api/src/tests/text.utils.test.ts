import { describe, it, expect } from "vitest";
import { normalizeText } from "../utils/text.utils";

describe("normalizeText", () => {
  it("bỏ dấu và viết thường", () => {
    expect(normalizeText("Nguyễn Văn Á")).toBe("nguyen van a");
  });

  it("xử lý chữ đ/Đ", () => {
    expect(normalizeText("Đặng Đức")).toBe("dang duc");
  });

  it("gộp khoảng trắng thừa", () => {
    expect(normalizeText("  Lê   Thị  Mai ")).toBe("le thi mai");
  });

  it("chuỗi không dấu giữ nguyên", () => {
    expect(normalizeText("john smith")).toBe("john smith");
  });
});