/*
  Warnings:

  - You are about to drop the column `userConsultantId` on the `groupchat` table. All the data in the column will be lost.
  - Added the required column `consultantId` to the `groupChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `groupChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `groupchat` DROP FOREIGN KEY `groupChat_userConsultantId_fkey`;

-- AlterTable
ALTER TABLE `groupchat` DROP COLUMN `userConsultantId`,
    ADD COLUMN `consultantId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `groupChat` ADD CONSTRAINT `groupChat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `groupChat` ADD CONSTRAINT `groupChat_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `consultant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
