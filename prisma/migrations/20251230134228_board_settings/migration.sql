/*
  Warnings:

  - You are about to drop the column `creatorId` on the `RetroSession` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `RetroSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTemp` on the `RetroSession` table. All the data in the column will be lost.
  - You are about to drop the column `isGoogleLinked` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('OWNER', 'ADMIN', 'FACILITATOR', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "PaymentTier" AS ENUM ('FREE', 'BELIEVER', 'SUPPORTER', 'CHAMPION');

-- AlterTable
ALTER TABLE "ActionItem" ADD COLUMN     "assignedToId" TEXT;

-- AlterTable
ALTER TABLE "RetroSession" DROP COLUMN "creatorId",
DROP COLUMN "isPrivate",
DROP COLUMN "isTemp";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isGoogleLinked",
ADD COLUMN     "paymentTier" "PaymentTier" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "BoardSettings" (
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "privateOpenAccess" BOOLEAN NOT NULL DEFAULT false,
    "privateCardRetention" INTEGER NOT NULL DEFAULT 7,
    "ownerId" TEXT,
    "isCommentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "commentsAnytime" BOOLEAN NOT NULL DEFAULT true,
    "isMusicEnabled" BOOLEAN NOT NULL DEFAULT true,
    "musicAnytime" BOOLEAN NOT NULL DEFAULT true,
    "isTimerEnabled" BOOLEAN NOT NULL DEFAULT true,
    "timerDefault" INTEGER NOT NULL DEFAULT 300,
    "timerAnytime" BOOLEAN NOT NULL DEFAULT true,
    "isUpvotingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "upvoteLimit" INTEGER NOT NULL DEFAULT -1,
    "upvoteAnytime" BOOLEAN NOT NULL DEFAULT true,
    "isCardGroupingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "cardGroupingAnytime" BOOLEAN NOT NULL DEFAULT false,
    "isFocusModeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isAiNamingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isAiSummaryEnabled" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,
    "retroSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardInvite" (
    "id" TEXT NOT NULL,
    "boardSettingsId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "BoardInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardMember" (
    "userId" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "role" "BoardRole" NOT NULL DEFAULT 'MEMBER',
    "permissionMask" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardMember_pkey" PRIMARY KEY ("userId","settingsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardSettings_retroSessionId_key" ON "BoardSettings"("retroSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardInvite_boardSettingsId_key" ON "BoardInvite"("boardSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardInvite_token_key" ON "BoardInvite"("token");

-- CreateIndex
CREATE INDEX "BoardInvite_expiresAt_idx" ON "BoardInvite"("expiresAt");

-- CreateIndex
CREATE INDEX "BoardMember_settingsId_idx" ON "BoardMember"("settingsId");

-- AddForeignKey
ALTER TABLE "BoardSettings" ADD CONSTRAINT "BoardSettings_retroSessionId_fkey" FOREIGN KEY ("retroSessionId") REFERENCES "RetroSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardInvite" ADD CONSTRAINT "BoardInvite_boardSettingsId_fkey" FOREIGN KEY ("boardSettingsId") REFERENCES "BoardSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "BoardSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
