/*
  Warnings:

  - You are about to drop the `UserRetroSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRetroSession" DROP CONSTRAINT "UserRetroSession_retroSessionId_fkey";

-- DropForeignKey
ALTER TABLE "UserRetroSession" DROP CONSTRAINT "UserRetroSession_userId_fkey";

-- AlterTable
ALTER TABLE "BoardSettings" ADD COLUMN     "musicRestricted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timerRestricted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "upvoteRestricted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserRetroSession";
