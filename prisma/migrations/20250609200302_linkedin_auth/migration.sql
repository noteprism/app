/*
  Warnings:

  - You are about to drop the column `groupId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `NoteGroup` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[linkedinId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedinId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_groupId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "groupId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "linkedinId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "NoteGroup";

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedinId_key" ON "User"("linkedinId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
