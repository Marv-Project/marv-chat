-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "branchedAtMsgIdx" INTEGER,
ADD COLUMN     "branchedFromId" TEXT;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_branchedFromId_fkey" FOREIGN KEY ("branchedFromId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
