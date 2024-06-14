/*
  Warnings:

  - Added the required column `endAt` to the `groupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `groupchat` ADD COLUMN `endAt` DATETIME(3) NOT NULL,
    ADD COLUMN `startAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
