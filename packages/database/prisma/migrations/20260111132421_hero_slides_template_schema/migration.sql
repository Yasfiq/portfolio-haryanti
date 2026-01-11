/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `leftSubtitle` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `leftTitle` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `rightSubtitle` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `rightTitle` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "backgroundColor" TEXT,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "HeroSlide" DROP COLUMN "imageUrl",
DROP COLUMN "leftSubtitle",
DROP COLUMN "leftTitle",
DROP COLUMN "rightSubtitle",
DROP COLUMN "rightTitle",
ADD COLUMN     "schema" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "template" TEXT NOT NULL DEFAULT 'classic';

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "spotifyUrl",
ADD COLUMN     "pinterestUrl" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "client",
ADD COLUMN     "clientId" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "heroTemplate" TEXT NOT NULL DEFAULT 'slides',
ADD COLUMN     "whatsappNumber" TEXT;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
