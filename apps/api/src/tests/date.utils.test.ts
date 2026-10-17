import { describe, it, expect } from "vitest";
import {
  calculateExpiryDate,
  getMemberStatus,
  parseDateOnly,
  formatDateOnly,
  toDbDate,
  fromDbDate,
} from "../services/date.utils";

// Tạo ngày theo giờ địa phương (tháng tính từ 1 cho dễ đọc)
const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

describe("calculateExpiryDate (ngày hết hạn = ngày tập cuối)", () => {
  it("30 ngày từ 17/10/2026 -> 15/11/2026", () => {
    expect(calculateExpiryDate(d(2026, 10, 17), 30)).toEqual(d(2026, 11, 15));
  });

  it("1 ngày -> hết hạn ngay trong ngày bắt đầu", () => {
    expect(calculateExpiryDate(d(2026, 10, 17), 1)).toEqual(d(2026, 10, 17));
  });

  it("90 ngày từ 17/10/2026 -> 14/01/2027", () => {
    expect(calculateExpiryDate(d(2026, 10, 17), 90)).toEqual(d(2027, 1, 14));
  });

  it("qua năm mới: 20/12/2026 + 30 ngày -> 18/01/2027", () => {
    expect(calculateExpiryDate(d(2026, 12, 20), 30)).toEqual(d(2027, 1, 18));
  });

  it("tháng 2 năm thường: 01/02/2027 + 30 ngày -> 02/03/2027", () => {
    expect(calculateExpiryDate(d(2027, 2, 1), 30)).toEqual(d(2027, 3, 2));
  });

  it("tháng 2 năm nhuận: 01/02/2028 + 30 ngày -> 01/03/2028", () => {
    expect(calculateExpiryDate(d(2028, 2, 1), 30)).toEqual(d(2028, 3, 1));
  });

  it("365 ngày từ 17/10/2026 -> 16/10/2027", () => {
    expect(calculateExpiryDate(d(2026, 10, 17), 365)).toEqual(d(2027, 10, 16));
  });

  it("báo lỗi khi số ngày không hợp lệ", () => {
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

  it("hết hạn đúng hôm nay -> EXPIRING (hôm nay vẫn được tập)", () => {
    expect(getMemberStatus(d(2026, 10, 17), today)).toBe("EXPIRING");
  });

  it("hết hạn hôm qua -> EXPIRED", () => {
    expect(getMemberStatus(d(2026, 10, 16), today)).toBe("EXPIRED");
  });

  it("hết hạn đã lâu -> EXPIRED", () => {
    expect(getMemberStatus(d(2025, 1, 1), today)).toBe("EXPIRED");
  });
});

describe("gói 30 ngày bắt đầu 17/10/2026", () => {
  const expiry = calculateExpiryDate(d(2026, 10, 17), 30); // 15/11/2026

  it("ngày thứ 30 (15/11) vẫn được tập", () => {
    expect(getMemberStatus(expiry, d(2026, 11, 15))).toBe("EXPIRING");
  });

  it("ngày thứ 31 (16/11) báo hết hạn", () => {
    expect(getMemberStatus(expiry, d(2026, 11, 16))).toBe("EXPIRED");
  });
});

describe("xử lý ngày thuần", () => {
  it("parseDateOnly và formatDateOnly đối xứng", () => {
    expect(formatDateOnly(parseDateOnly("2026-10-17"))).toBe("2026-10-17");
  });

  it("phát hiện ngày không tồn tại (30/02)", () => {
    expect(formatDateOnly(parseDateOnly("2026-02-30"))).not.toBe("2026-02-30");
  });

  it("toDbDate rồi fromDbDate trả lại đúng ngày cũ", () => {
    const original = new Date(2026, 9, 17);
    expect(fromDbDate(toDbDate(original))).toEqual(original);
  });

  it("toDbDate lưu đúng ngày theo UTC", () => {
    expect(toDbDate(new Date(2026, 9, 17)).toISOString()).toBe("2026-10-17T00:00:00.000Z");
  });
});