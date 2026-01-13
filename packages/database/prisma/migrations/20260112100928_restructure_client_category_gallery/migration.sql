/*
  Warnings:

  - You are about to drop the column `description` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioImage" DROP CONSTRAINT "PortfolioImage_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioLike" DROP CONSTRAINT "PortfolioLike_portfolioId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "description",
ADD COLUMN     "thumbnailUrl" TEXT;

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "PortfolioImage";

-- DropTable
DROP TABLE "PortfolioLike";

-- CreateTable
CREATE TABLE "CategoryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CategoryImage" ADD CONSTRAINT "CategoryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ClientCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
