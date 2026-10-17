import { addDays, differenceInCalendarDays } from "date-fns";

//các trạng thái
export type MemberStatus = "ACTIVE" | "EXPIRING" | "EXPIRED";
const pad = (n: number) => String(n).padStart(2, "0");
//còn 7 ngày thì báo sắp hết hạn
export const EXPIRING_DAYS = 7;

// Tính ngày hết hạn
export function calculateExpiryDate(startDate: Date, days: number): Date {
  if (!Number.isInteger(days) || days <= 0) {
    throw new Error("Số ngày phải là số nguyên lớn hơn 0");
  }
  return addDays(startDate, days - 1);
}

//kiểm tra trạng thái
export function getMemberStatus(expiryDate: Date, today: Date): MemberStatus{
    const daysLeft = differenceInCalendarDays(expiryDate, today);
    if(daysLeft < 0){
        return "EXPIRED";
    }
    if (daysLeft <= 7){
        return "EXPIRING";
    }
    return "ACTIVE";
}
/** "2026-10-17" -> Date (nửa đêm giờ địa phương) */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Date -> "2026-10-17" */
export function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Ngày giờ địa phương -> Date để lưu cột DATE (UTC), tránh lệch 1 ngày */
export function toDbDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/** Date đọc từ cột DATE (UTC) -> ngày địa phương để tính toán */
export function fromDbDate(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** "Hôm nay" theo múi giờ của ứng dụng, không phụ thuộc múi giờ máy chủ */
export function getToday(
  timeZone = process.env.APP_TIMEZONE ?? "Asia/Ho_Chi_Minh",
): Date {
  const text = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parseDateOnly(text);
}