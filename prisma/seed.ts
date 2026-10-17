import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const packages = [
    {name: "1 tháng", months: 1, price: 350},
    {name: "3 tháng", months: 3, price: 950},
    {name: "6 tháng", months: 6, price: 1900},
    {name: "12 tháng", months: 12, price: 3500},
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
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
}).finally(() => prisma.$disconnect());