-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "flag" VARCHAR(255) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);
