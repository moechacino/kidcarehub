/*
  Warnings:

  - Added the required column `updatedAt` to the `groupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `groupchat` ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updatedAt` TIMESTAMP(0) NOT NULL;
