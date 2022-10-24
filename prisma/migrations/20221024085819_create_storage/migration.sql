/*
  Warnings:

  - You are about to drop the `Files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Files";

-- CreateTable
CREATE TABLE "Storage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bucket" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(50) NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Storage_path_key" ON "Storage"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_bucket_path_key" ON "Storage"("bucket", "path");
