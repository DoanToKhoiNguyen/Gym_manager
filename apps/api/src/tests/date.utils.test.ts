import { describe, it, expect } from "vitest";
import { calculateExpiryDate, getMemberStatus } from "../services/date.utils";

// Tạo ngày theo giờ địa phương (tháng tính từ 1 cho dễ đọc)
const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

describe("calculateExpiryDate", () => {
  it("15/01 + 1 tháng = 15/02", () => {
    expect(calculateExpiryDate(d(2026, 1, 15), 1)).toEqual(d(2026, 2, 15));
  });

  it("31/01 + 1 tháng = 28/02 (năm thường)", () => {
    expect(calculateExpiryDate(d(2027, 1, 31), 1)).toEqual(d(2027, 2, 28));
  });

  it("31/01 + 1 tháng = 29/02 (năm nhuận)", () => {
    expect(calculateExpiryDate(d(2028, 1, 31), 1)).toEqual(d(2028, 2, 29));
  });

  it("qua năm mới: 15/11/2026 + 3 tháng = 15/02/2027", () => {
    expect(calculateExpiryDate(d(2026, 11, 15), 3)).toEqual(d(2027, 2, 15));
  });

  it("12 tháng: 17/10/2026 -> 17/10/2027", () => {
    expect(calculateExpiryDate(d(2026, 10, 17), 12)).toEqual(d(2027, 10, 17));
  });

  it("báo lỗi khi số tháng không hợp lệ", () => {
    expect(() => calculateExpiryDate(d(2026, 1, 1), 0)).toThrow();
    expect(() => calculateExpiryDate(d(2026, 1, 1), -3)).toThrow();
    expect(() => calculateExpiryDate(d(2026, 1, 1), 1.5)).toThrow();
  });
});

describe("getMemberStatus", () => {
  const today = d(2026, 10, 17);

  it("còn 8 ngày -> ACTIVE", () => {
    expect(getMemberStatus(d(2026, 10, 25), today)).toBe("ACTIVE");
  });

  it("còn đúng 7 ngày -> EXPIRING", () => {
    expect(getMemberStatus(d(2026, 10, 24), today)).toBe("EXPIRING");
  });

  it("hết hạn đúng hôm nay -> EXPIRING (vẫn còn hiệu lực)", () => {
    expect(getMemberStatus(d(2026, 10, 17), today)).toBe("EXPIRING");
  });

  it("hết hạn hôm qua -> EXPIRED", () => {
    expect(getMemberStatus(d(2026, 10, 16), today)).toBe("EXPIRED");
  });

  it("hết hạn đã lâu -> EXPIRED", () => {
    expect(getMemberStatus(d(2025, 1, 1), today)).toBe("EXPIRED");
  });
});