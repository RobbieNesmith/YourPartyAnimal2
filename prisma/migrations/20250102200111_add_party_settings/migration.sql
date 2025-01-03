-- AlterTable
ALTER TABLE "users" ADD COLUMN     "promotion_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "promotion_value" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "removal_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "removal_value" INTEGER NOT NULL DEFAULT -10;
