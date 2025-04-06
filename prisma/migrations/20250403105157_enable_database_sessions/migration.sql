/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Vinyl` table. All the data in the column will be lost.
  - You are about to drop the column `genreId` on the `Vinyl` table. All the data in the column will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artist` to the `Vinyl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Vinyl` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vinyl" DROP CONSTRAINT "Vinyl_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Vinyl" DROP CONSTRAINT "Vinyl_genreId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vinyl" DROP COLUMN "artistId",
DROP COLUMN "genreId",
ADD COLUMN     "addedById" TEXT,
ADD COLUMN     "artist" TEXT NOT NULL,
ADD COLUMN     "genre" TEXT NOT NULL;

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "Genre";

-- AddForeignKey
ALTER TABLE "Vinyl" ADD CONSTRAINT "Vinyl_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
