/*
  Warnings:

  - Added the required column `species` to the `Fish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterType` to the `Fish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Fish` ADD COLUMN `species` VARCHAR(255) NOT NULL,
    ADD COLUMN `waterType` ENUM('FRESHWATER', 'SALTWATER', 'BRACKISH') NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NULL;

-- CreateIndex
CREATE INDEX `Fish_name_idx` ON `Fish`(`name`);

-- CreateIndex
CREATE INDEX `Fish_species_idx` ON `Fish`(`species`);
