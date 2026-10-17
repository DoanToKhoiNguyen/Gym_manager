import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { normalizeText } from "../utils/text.utils";

function buildWhere(search?: string): Prisma.MemberWhereInput | undefined {
  const keyword = search?.trim();
  if (!keyword) return undefined;
  return {
    OR: [
      { searchName: { contains: normalizeText(keyword) } },
      { phone: { contains: keyword } },
    ],
  };
}

export const memberRepository = {
  findById(id: number) {
    return prisma.member.findUnique({ where: { id }, include: { package: true } });
  },

  findByPhone(phone: string) {
    return prisma.member.findUnique({ where: { phone } });
  },

  async findPage(params: { search?: string; page: number; pageSize: number }) {
    const where = buildWhere(params.search);
    const [items, total] = await prisma.$transaction([
      prisma.member.findMany({
        where,
        include: { package: true },
        orderBy: { id: "desc" },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),
      prisma.member.count({ where }),
    ]);
    return { items, total };
  },

  create(data: Prisma.MemberUncheckedCreateInput) {
    return prisma.member.create({ data, include: { package: true } });
  },

  update(id: number, data: Prisma.MemberUncheckedUpdateInput) {
    return prisma.member.update({ where: { id }, data, include: { package: true } });
  },

  delete(id: number) {
    return prisma.member.delete({ where: { id } });
  },
};