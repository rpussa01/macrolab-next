/*
  Warnings:

  - You are about to drop the column `alories` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "alories",
ADD COLUMN     "calories" INTEGER;
