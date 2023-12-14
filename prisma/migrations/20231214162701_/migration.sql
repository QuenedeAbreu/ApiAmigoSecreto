/*
  Warnings:

  - Made the column `description` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `description` VARCHAR(191) NOT NULL;
