/*
  Warnings:

  - You are about to drop the column `tiktokUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeUrl` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "tiktokUrl",
DROP COLUMN "youtubeUrl";
