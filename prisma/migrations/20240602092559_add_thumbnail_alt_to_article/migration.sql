/*
  Warnings:

  - Added the required column `thumbnail_alt` to the `article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article` ADD COLUMN `thumbnail_alt` VARCHAR(191) NOT NULL;
