/*
  Warnings:

  - You are about to drop the column `cardGroupingAnytime` on the `BoardSettings` table. All the data in the column will be lost.
  - You are about to drop the column `isAiNamingEnabled` on the `BoardSettings` table. All the data in the column will be lost.
  - You are about to drop the column `isCardGroupingEnabled` on the `BoardSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BoardSettings" DROP COLUMN "cardGroupingAnytime",
DROP COLUMN "isAiNamingEnabled",
DROP COLUMN "isCardGroupingEnabled",
ADD COLUMN     "aiCardGroupNamingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cardGroupingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDragAndDropEnabled" BOOLEAN NOT NULL DEFAULT true;
