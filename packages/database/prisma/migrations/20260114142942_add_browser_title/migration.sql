/*
  Warnings:

  - You are about to drop the column `heroTemplate` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "heroTemplate",
ADD COLUMN     "browserTitle" TEXT;
