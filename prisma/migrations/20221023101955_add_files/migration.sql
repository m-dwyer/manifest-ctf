-- CreateTable
CREATE TABLE "Files" (
    "id" SERIAL NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_path_key" ON "Files"("path");
