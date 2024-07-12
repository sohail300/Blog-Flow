/*
  Warnings:

  - You are about to drop the column `expiryforgotPasswordOTP` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordOTP` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "expiryforgotPasswordOTP",
DROP COLUMN "forgotPasswordOTP",
ADD COLUMN     "expiryforgotPasswordToken" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordToken" TEXT;
