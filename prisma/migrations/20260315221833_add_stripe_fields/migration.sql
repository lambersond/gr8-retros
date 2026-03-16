/*
  Warnings:

  - You are about to drop the column `isPatreonLinked` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPatreonLinked",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "pendingPaymentTier" "PaymentTier",
ADD COLUMN     "stripeCustomerId" TEXT;
