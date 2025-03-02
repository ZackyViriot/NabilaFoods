-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageData" BYTEA,
ADD COLUMN     "imageMime" TEXT,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TempUpload" (
    "id" TEXT NOT NULL,
    "imageData" BYTEA NOT NULL,
    "imageMime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempUpload_pkey" PRIMARY KEY ("id")
);
