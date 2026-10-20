-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('ACCEPTED', 'TOXIC', 'JUDI_ONLINE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderId" TEXT,
    "streamerId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'ACCEPTED',
    "toxicScore" DOUBLE PRECISION,
    "judiScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
