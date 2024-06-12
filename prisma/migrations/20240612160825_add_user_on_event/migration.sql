/*
  Warnings:

  - Added the required column `id_user` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `id_user` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
