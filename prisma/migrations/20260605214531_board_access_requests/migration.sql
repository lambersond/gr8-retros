-- CreateEnum
CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING', 'REJECTED');

-- CreateTable
CREATE TABLE "BoardAccessRequest" (
    "userId" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "status" "AccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardAccessRequest_pkey" PRIMARY KEY ("userId","settingsId")
);

-- CreateIndex
CREATE INDEX "BoardAccessRequest_settingsId_idx" ON "BoardAccessRequest"("settingsId");

-- AddForeignKey
ALTER TABLE "BoardAccessRequest" ADD CONSTRAINT "BoardAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardAccessRequest" ADD CONSTRAINT "BoardAccessRequest_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "BoardSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
