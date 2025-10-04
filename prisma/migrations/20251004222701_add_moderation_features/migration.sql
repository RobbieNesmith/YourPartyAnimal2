-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rate_limit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "stop_requests" BOOLEAN NOT NULL DEFAULT false;
