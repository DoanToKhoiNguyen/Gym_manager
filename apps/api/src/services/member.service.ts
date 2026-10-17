import type { Member, Package } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { memberRepository } from "../repositories/member.repository";
import { packageRepository } from "../repositories/package.repository";
import { normalizeText } from "../utils/text.utils";
import type {
  CreateMemberInput,
  UpdateMemberInput,
} from "../validators/member.validator";
import {
  calculateExpiryDate,
  formatDateOnly,
  fromDbDate,
  getMemberStatus,
  getToday,
  parseDateOnly,
  toDbDate,
} from "./date.utils";

type MemberWithPackage = Member & { package: Package };

// Dữ liệu trả về cho frontend, trạng thái do server tính
function toDto(m: MemberWithPackage, today: Date) {
  const expiry = fromDbDate(m.expiryDate);
  return {
    id: m.id,
    fullName: m.fullName,
    phone: m.phone,
    gender: m.gender,
    birthDate: m.birthDate ? formatDateOnly(fromDbDate(m.birthDate)) : null,
    email: m.email,
    note: m.note,
    packageId: m.packageId,
    packageName: m.package.name,
    startDate: formatDateOnly(fromDbDate(m.startDate)),
    expiryDate: formatDateOnly(expiry),
    status: getMemberStatus(expiry, today),
  };
}

function memberNotFound() {
  return new AppError(404, "MEMBER_NOT_FOUND", "Không tìm thấy hội viên");
}

function packageNotFound() {
  return new AppError(404, "PACKAGE_NOT_FOUND", "Không tìm thấy gói tập", "packageId");
}

export const memberService = {
  async list(params: { search?: string; page: number; pageSize: number }) {
    const { items, total } = await memberRepository.findPage(params);
    const today = getToday();
    return {
      items: items.map((m) => toDto(m, today)),
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    };
  },

  async getById(id: number) {
    const member = await memberRepository.findById(id);
    if (!member) throw memberNotFound();
    return toDto(member, getToday());
  },

  async previewExpiry(packageId: number, startDate?: string) {
    const pkg = await packageRepository.findById(packageId);
    if (!pkg) throw packageNotFound();
    const start = startDate ? parseDateOnly(startDate) : getToday();
    const expiry = calculateExpiryDate(start, pkg.months);
    return { startDate: formatDateOnly(start), expiryDate: formatDateOnly(expiry) };
  },

  async create(input: CreateMemberInput) {
    const pkg = await packageRepository.findById(input.packageId);
    if (!pkg) throw packageNotFound();
    if (!pkg.isActive) {
      throw new AppError(400, "PACKAGE_INACTIVE", "Gói tập này đã ngừng bán", "packageId");
    }

    const existing = await memberRepository.findByPhone(input.phone);
    if (existing) {
      throw new AppError(409, "PHONE_DUPLICATED", "SĐT đã tồn tại", "phone");
    }

    const start = input.startDate ? parseDateOnly(input.startDate) : getToday();
    const expiry = calculateExpiryDate(start, pkg.months); // lưu cứng

    const created = await memberRepository.create({
      fullName: input.fullName,
      searchName: normalizeText(input.fullName),
      phone: input.phone,
      gender: input.gender,
      birthDate: input.birthDate ? toDbDate(parseDateOnly(input.birthDate)) : undefined,
      email: input.email,
      note: input.note,
      packageId: pkg.id,
      startDate: toDbDate(start),
      expiryDate: toDbDate(expiry),
    });

    return toDto(created, getToday());
  },

  async update(id: number, input: UpdateMemberInput) {
    const current = await memberRepository.findById(id);
    if (!current) throw memberNotFound();

    if (input.phone !== current.phone) {
      const duplicated = await memberRepository.findByPhone(input.phone);
      if (duplicated) {
        throw new AppError(409, "PHONE_DUPLICATED", "SĐT đã tồn tại", "phone");
      }
    }

    // Mặc định giữ nguyên gói và ngày hết hạn đã lưu
    let packageId = current.packageId;
    let startDate = current.startDate;
    let expiryDate = current.expiryDate;

    // Chỉ tính lại khi gói hoặc ngày bắt đầu THỰC SỰ đổi,
    // để sửa tên/SĐT không làm lệch ngày hết hạn đã lưu cứng
    const newPackageId = input.packageId ?? current.packageId;
    const currentStart = formatDateOnly(fromDbDate(current.startDate));
    const newStart = input.startDate ?? currentStart;
    const changed = newPackageId !== current.packageId || newStart !== currentStart;

    if (changed) {
      const pkg = await packageRepository.findById(newPackageId);
      if (!pkg) throw packageNotFound();
      if (!pkg.isActive && newPackageId !== current.packageId) {
        throw new AppError(400, "PACKAGE_INACTIVE", "Gói tập này đã ngừng bán", "packageId");
      }
      const start = parseDateOnly(newStart);
      packageId = pkg.id;
      startDate = toDbDate(start);
      expiryDate = toDbDate(calculateExpiryDate(start, pkg.months));
    }

    const updated = await memberRepository.update(id, {
      fullName: input.fullName,
      searchName: normalizeText(input.fullName),
      phone: input.phone,
      gender: input.gender,
      birthDate: input.birthDate ? toDbDate(parseDateOnly(input.birthDate)) : null,
      email: input.email,
      note: input.note,
      packageId,
      startDate,
      expiryDate,
    });

    return toDto(updated, getToday());
  },

  async remove(id: number) {
    const current = await memberRepository.findById(id);
    if (!current) throw memberNotFound();
    await memberRepository.delete(id);
  },
};