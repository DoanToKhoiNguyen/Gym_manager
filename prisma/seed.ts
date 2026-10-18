import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { normalizeText } from "../apps/api/src/utils/text.utils";

const prisma = new PrismaClient();

const packages = [
    {name: "1 tháng", months: 30, price: 350},
    {name: "3 tháng", months: 90, price: 950},
    {name: "6 tháng", months: 180, price: 1900},
    {name: "12 tháng", months: 365, price: 3500},
];

async function main() {
  for (const p of packages) {
    await prisma.package.upsert({ where: { name: p.name }, update: {}, create: p });
  }
  console.log("Đã nạp gói tập mẫu");

  const members = await prisma.member.findMany({ select: { id: true, fullName: true } });
  for (const m of members) {
    await prisma.member.update({
      where: { id: m.id },
      data: { searchName: normalizeText(m.fullName) },
    });
  }
  console.log(`Đã cập nhật searchName cho ${members.length} hội viên`);

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username, passwordHash, fullName: "Quản trị viên" },
  });
  console.log(`Tài khoản admin sẵn sàng: ${username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());