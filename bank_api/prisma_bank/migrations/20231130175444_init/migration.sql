/*
  Warnings:

  - Added the required column `token` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token" TEXT NOT NULL;
