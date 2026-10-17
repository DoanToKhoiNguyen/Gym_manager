import { z } from "zod";
import { formatDateOnly, parseDateOnly } from "../services/date.utils";

// Chuỗi ngày hợp lệ dạng YYYY-MM-DD (chặn cả 2026-02-30)
const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải có dạng YYYY-MM-DD")
  .refine((v) => formatDateOnly(parseDateOnly(v)) === v, "Ngày không tồn tại");

// Ô tùy chọn khi tạo: chuỗi rỗng coi như không nhập
const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

// Ô tùy chọn khi sửa: để trống nghĩa là xóa giá trị (đặt về null)
const emptyToNull = (v: unknown) =>
  v === undefined || (typeof v === "string" && v.trim() === "") ? null : v;

const phone = z
  .string()
  .trim()
  .regex(/^0\d{9}$/, "SĐT phải gồm 10 chữ số và bắt đầu bằng 0");

const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const memberIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Mã hội viên không hợp lệ"),
});

export const createMemberSchema = z.object({
  fullName: z.string().trim().min(1, "Họ tên không được để trống"),
  phone,
  gender: z.preprocess(emptyToUndefined, genderEnum.optional()),
  birthDate: z.preprocess(emptyToUndefined, dateOnly.optional()),
  email: z.preprocess(emptyToUndefined, z.string().trim().email("Email không hợp lệ").optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  packageId: z.number().int("Gói tập không hợp lệ").positive("Gói tập không hợp lệ"),
  startDate: z.preprocess(emptyToUndefined, dateOnly.optional()),
});

// Sửa: gửi lại toàn bộ thông tin cá nhân; gói và ngày bắt đầu là tùy chọn
export const updateMemberSchema = z.object({
  fullName: z.string().trim().min(1, "Họ tên không được để trống"),
  phone,
  gender: z.preprocess(emptyToNull, genderEnum.nullable()),
  birthDate: z.preprocess(emptyToNull, dateOnly.nullable()),
  email: z.preprocess(emptyToNull, z.string().trim().email("Email không hợp lệ").nullable()),
  note: z.preprocess(emptyToNull, z.string().trim().nullable()),
  packageId: z
    .number()
    .int("Gói tập không hợp lệ")
    .positive("Gói tập không hợp lệ")
    .optional(),
  startDate: z.preprocess(emptyToUndefined, dateOnly.optional()),
});

export const listMembersQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1, "Trang phải từ 1 trở lên").default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1, "Số dòng mỗi trang phải từ 1 trở lên")
    .max(100, "Tối đa 100 dòng mỗi trang")
    .default(10),
});

export const previewExpiryQuerySchema = z.object({
  packageId: z.coerce.number().int().positive("Gói tập không hợp lệ"),
  startDate: z.preprocess(emptyToUndefined, dateOnly.optional()),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;