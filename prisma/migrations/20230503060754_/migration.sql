/*
  Warnings:

  - The `completed` column on the `ChallengeAttempt` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ChallengeAttempt" DROP COLUMN "completed",
ADD COLUMN     "completed" TIMESTAMP(3);
