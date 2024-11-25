/*
  Warnings:

  - You are about to drop the column `url` on the `songs` table. All the data in the column will be lost.
  - Added the required column `video_id` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "songs" DROP COLUMN "url",
ADD COLUMN     "video_id" TEXT NOT NULL,
ALTER COLUMN "played_at" DROP NOT NULL;
