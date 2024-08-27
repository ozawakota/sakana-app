/*
  Warnings:

  - You are about to drop the column `likes` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `replyToId` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `retweets` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tweet` DROP FOREIGN KEY `Tweet_replyToId_fkey`;

-- AlterTable
ALTER TABLE `Tweet` DROP COLUMN `likes`,
    DROP COLUMN `replyToId`,
    DROP COLUMN `retweets`;
