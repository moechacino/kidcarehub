-- AlterTable
ALTER TABLE `admin` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `consultant` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `chatUserConsultant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `consultantId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `chatUserConsultant_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groupChat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomName` VARCHAR(191) NOT NULL,
    `userConsultantId` INTEGER NOT NULL,

    UNIQUE INDEX `groupChat_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupChatId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `senderRole` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `message_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chatUserConsultant` ADD CONSTRAINT `chatUserConsultant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatUserConsultant` ADD CONSTRAINT `chatUserConsultant_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `consultant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `groupChat` ADD CONSTRAINT `groupChat_userConsultantId_fkey` FOREIGN KEY (`userConsultantId`) REFERENCES `chatUserConsultant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_groupChatId_fkey` FOREIGN KEY (`groupChatId`) REFERENCES `groupChat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
