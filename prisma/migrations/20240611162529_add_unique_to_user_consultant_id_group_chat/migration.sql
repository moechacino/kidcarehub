/*
  Warnings:

  - A unique constraint covering the columns `[userConsultantId]` on the table `groupChat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `groupChat_userConsultantId_key` ON `groupChat`(`userConsultantId`);
