import { PrismaClient } from "@prisma/client";
import { normalizeText } from "../apps/api/src/utils/text.utils";

const prisma = new PrismaClient();

const packages = [
    {name: "1 tháng", months: 30, price: 350},
    {name: "3 tháng", months: 90, price: 950},
    {name: "6 tháng", months: 180, price: 1900},
    {name: "12 tháng", months: 365, price: 3500},
];

async function main(){
    for (const p of packages) {
    await prisma.package.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }
  console.log("Đã nạp 4 gói tập mẫu");

// Điền searchName cho hội viên đã có từ trước khi thêm cột này
  const members = await prisma.member.findMany({
    select: { id: true, fullName: true },
  });
  for (const m of members) {
    await prisma.member.update({
      where: { id: m.id },
      data: { searchName: normalizeText(m.fullName) },
    });
  }
  console.log(`Đã cập nhật searchName cho ${members.length} hội viên`);
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
}).finally(() => prisma.$disconnect());