/*
  Warnings:

  - You are about to drop the column `addedById` on the `Vinyl` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Vinyl` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Vinyl` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vinyl` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Vinyl` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `adminId` to the `Vinyl` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vinyl" DROP CONSTRAINT "Vinyl_addedById_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Vinyl" DROP COLUMN "addedById",
DROP COLUMN "imageUrl",
DROP COLUMN "releaseYear",
DROP COLUMN "updatedAt",
ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Vinyl" ADD CONSTRAINT "Vinyl_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
