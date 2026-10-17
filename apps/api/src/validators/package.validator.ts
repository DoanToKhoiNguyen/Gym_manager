import { z } from "zod";
import { formatDateOnly, parseDateOnly } from "../services/date.utils";

export const createPackageSchema = z.object({
  name: z.string().trim().min(1, "Tên gói không được để trống"),
  months: z
    .number()
    .int("Số tháng phải là số nguyên")
    .positive("Số tháng phải lớn hơn 0"),
  price: z.number().int("Giá phải là số nguyên").min(0, "Giá không được âm"),
});

export const listPackagesQuerySchema = z.object({
  active: z.enum(["true", "false"]).optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>; 
