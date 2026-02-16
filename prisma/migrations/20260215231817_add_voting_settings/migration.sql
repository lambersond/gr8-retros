/*
  Warnings:

  - You are about to drop the column `isFocusModeEnabled` on the `BoardSettings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VotingMode" AS ENUM ('SINGLE', 'MULTI');

-- AlterTable
ALTER TABLE "BoardSettings" DROP COLUMN "isFocusModeEnabled",
ADD COLUMN     "isActionItemsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFacilitatorModeEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVotingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "votingLimit" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "votingMode" "VotingMode" NOT NULL DEFAULT 'MULTI',
ADD COLUMN     "votingRestricted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "votes" INTEGER NOT NULL DEFAULT 0;
