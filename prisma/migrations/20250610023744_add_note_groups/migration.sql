/*
  Warnings:

  - You are about to drop the column `groupId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `NoteGroup` table. All the data in the column will be lost.
  - Added the required column `name` to the `NoteGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_groupId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "groupId",
ADD COLUMN     "noteGroupId" TEXT;

-- AlterTable
ALTER TABLE "NoteGroup" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_noteGroupId_fkey" FOREIGN KEY ("noteGroupId") REFERENCES "NoteGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
