/*
  Warnings:

  - You are about to drop the column `footerText` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `heroImageUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "footerText",
DROP COLUMN "heroImageUrl",
DROP COLUMN "name",
DROP COLUMN "profileImageUrl",
DROP COLUMN "tagline",
ADD COLUMN     "title" TEXT;
