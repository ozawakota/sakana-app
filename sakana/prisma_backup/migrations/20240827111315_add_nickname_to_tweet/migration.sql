/*
  Warnings:

  - Added the required column `nickname` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tweet` ADD COLUMN `nickname` VARCHAR(50) NOT NULL;
