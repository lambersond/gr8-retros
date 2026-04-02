-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "cardGroupId" TEXT,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "position" SET DEFAULT 0,
ALTER COLUMN "position" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "CardGroup" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retroSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardGroup_retroSessionId_idx" ON "CardGroup"("retroSessionId");

-- CreateIndex
CREATE INDEX "CardGroup_retroSessionId_column_idx" ON "CardGroup"("retroSessionId", "column");

-- CreateIndex
CREATE INDEX "Card_retroSessionId_column_idx" ON "Card"("retroSessionId", "column");

-- CreateIndex
CREATE INDEX "Card_cardGroupId_idx" ON "Card"("cardGroupId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_cardGroupId_fkey" FOREIGN KEY ("cardGroupId") REFERENCES "CardGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardGroup" ADD CONSTRAINT "CardGroup_retroSessionId_fkey" FOREIGN KEY ("retroSessionId") REFERENCES "RetroSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
