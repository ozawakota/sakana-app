-- AlterTable
ALTER TABLE `Tweet` ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `replyToId` INTEGER NULL,
    ADD COLUMN `retweets` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `Tweet_replyToId_idx` ON `Tweet`(`replyToId`);

-- AddForeignKey
ALTER TABLE `Tweet` ADD CONSTRAINT `Tweet_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `Tweet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
