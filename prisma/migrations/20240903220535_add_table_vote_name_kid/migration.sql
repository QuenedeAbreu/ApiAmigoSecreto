-- CreateTable
CREATE TABLE `VoteNameKid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_name` INTEGER NOT NULL,
    `vote` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VoteNameKid` ADD CONSTRAINT `VoteNameKid_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteNameKid` ADD CONSTRAINT `VoteNameKid_id_name_fkey` FOREIGN KEY (`id_name`) REFERENCES `NameKid`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
