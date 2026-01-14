/*
  Warnings:

  - You are about to drop the column `metadata` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "metadata",
ADD COLUMN     "modelId" TEXT,
ADD COLUMN     "totalTokens" INTEGER;

-- CreateIndex
CREATE INDEX "Stream_chatId_idx" ON "Stream"("chatId");
