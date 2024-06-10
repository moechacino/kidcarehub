/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `consultant` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `consultant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `consultant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `consultant_phoneNumber_key` ON `consultant`;

-- DropIndex
DROP INDEX `user_phoneNumber_key` ON `user`;

-- AlterTable
ALTER TABLE `consultant` DROP COLUMN `phoneNumber`,
    ADD COLUMN `phone` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `phoneNumber`,
    ADD COLUMN `phone` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `consultant_phone_key` ON `consultant`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `user_phone_key` ON `user`(`phone`);
