/*
  Warnings:

  - You are about to drop the column `endDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectLike` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `institution` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Made the column `degree` on table `Education` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectImage" DROP CONSTRAINT "ProjectImage_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectLike" DROP CONSTRAINT "ProjectLike_projectId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Admin';

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "endDate",
DROP COLUMN "schoolName",
DROP COLUMN "startDate",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endYear" INTEGER,
ADD COLUMN     "institution" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startYear" INTEGER NOT NULL,
ALTER COLUMN "degree" SET NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "avatarUrl",
DROP COLUMN "fullName",
DROP COLUMN "title",
ADD COLUMN     "footerText" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectCategory";

-- DropTable
DROP TABLE "ProjectImage";

-- DropTable
DROP TABLE "ProjectLike";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClientCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PortfolioImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioLike" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "userIpHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCategory_clientId_slug_key" ON "ClientCategory"("clientId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_slug_key" ON "Portfolio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioLike_portfolioId_userIpHash_key" ON "PortfolioLike"("portfolioId", "userIpHash");

-- AddForeignKey
ALTER TABLE "ClientCategory" ADD CONSTRAINT "ClientCategory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ClientCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioImage" ADD CONSTRAINT "PortfolioImage_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioLike" ADD CONSTRAINT "PortfolioLike_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
