/*
  Warnings:

  - You are about to drop the column `birthDay` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `Member` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "birthDay",
DROP COLUMN "fullname",
ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "searchName" TEXT NOT NULL DEFAULT '';
