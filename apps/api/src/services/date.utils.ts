import { addMonths, differenceInCalendarDays } from "date-fns";

//các trạng thái
export type MemberStatus = "ACTIVE" | "EXPIRING" | "EXPIRED";

//còn 7 ngày thì báo sắp hết hạn
export const EXPIRING_DAYS = 7;

// Tính ngày hết hạn
export function calculateExpiryDate(startDate: Date, months: number): Date{
    if(months <= 0 || !Number.isInteger(months)){
        throw new Error("Số tháng phải lớn hơn 0");
    }
    return addMonths(startDate, months);
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