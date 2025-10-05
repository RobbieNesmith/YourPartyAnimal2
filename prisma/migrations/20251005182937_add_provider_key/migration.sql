/*
  Warnings:

  - A unique constraint covering the columns `[provider_key]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_key` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_key_key" ON "users"("provider_key");
