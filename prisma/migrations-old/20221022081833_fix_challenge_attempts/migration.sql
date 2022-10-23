/*
  Warnings:

  - The primary key for the `ChallengeAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChallengeAttempt` table. All the data in the column will be lost.
  - Added the required column `challengeId` to the `ChallengeAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChallengeAttempt" DROP CONSTRAINT "ChallengeAttempt_id_fkey";

-- AlterTable
ALTER TABLE "ChallengeAttempt" DROP CONSTRAINT "ChallengeAttempt_pkey",
DROP COLUMN "id",
ADD COLUMN     "challengeId" INTEGER NOT NULL,
ADD CONSTRAINT "ChallengeAttempt_pkey" PRIMARY KEY ("userId", "challengeId");

-- AddForeignKey
ALTER TABLE "ChallengeAttempt" ADD CONSTRAINT "ChallengeAttempt_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
