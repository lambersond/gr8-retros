/*
  Warnings:

  - You are about to drop the column `timerAnytime` on the `BoardSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BoardSettings" DROP COLUMN "timerAnytime",
ADD COLUMN     "actionItemsAnytime" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actionItemsRestricted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commentsRestricted" BOOLEAN NOT NULL DEFAULT false;
