/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tutorials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Tutorials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tutorials" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tutorials_slug_key" ON "Tutorials"("slug");
