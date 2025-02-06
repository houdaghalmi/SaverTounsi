-- CreateTable
CREATE TABLE "UserChallengeProgress" (
    "id" TEXT NOT NULL,
    "userChallengeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChallengeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserChallengeProgress_userChallengeId_idx" ON "UserChallengeProgress"("userChallengeId");

-- AddForeignKey
ALTER TABLE "UserChallengeProgress" ADD CONSTRAINT "UserChallengeProgress_userChallengeId_fkey" FOREIGN KEY ("userChallengeId") REFERENCES "UserChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
