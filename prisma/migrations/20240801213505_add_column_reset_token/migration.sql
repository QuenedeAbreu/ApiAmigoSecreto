-- AlterTable
ALTER TABLE `User` ADD COLUMN `expiresToken` INTEGER NULL,
    ADD COLUMN `resettoken` VARCHAR(191) NULL;
