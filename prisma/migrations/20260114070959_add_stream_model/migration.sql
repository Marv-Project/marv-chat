/*
  Warnings:

  - You are about to drop the column `model` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "title" SET DEFAULT 'New Chat';

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "model";

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
