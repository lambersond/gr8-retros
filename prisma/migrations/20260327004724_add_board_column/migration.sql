-- CreateTable
CREATE TABLE "BoardColumn" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "boardSettingsId" TEXT NOT NULL,
    "columnType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "tagline" TEXT,
    "placeholder" TEXT,
    "emoji" TEXT,
    "lightBg" TEXT NOT NULL,
    "lightBorder" TEXT NOT NULL,
    "lightTitleBg" TEXT NOT NULL,
    "lightTitleText" TEXT NOT NULL,
    "darkBg" TEXT NOT NULL,
    "darkBorder" TEXT NOT NULL,
    "darkTitleBg" TEXT NOT NULL,
    "darkTitleText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardColumn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardColumn_boardSettingsId_columnType_key" ON "BoardColumn"("boardSettingsId", "columnType");

-- AddForeignKey
ALTER TABLE "BoardColumn" ADD CONSTRAINT "BoardColumn_boardSettingsId_fkey" FOREIGN KEY ("boardSettingsId") REFERENCES "BoardSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
