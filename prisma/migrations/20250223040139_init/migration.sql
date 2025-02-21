-- CreateTable
CREATE TABLE "LastCheckRecord" (
    "id" TEXT NOT NULL,
    "last_checked_at" INTEGER NOT NULL,

    CONSTRAINT "LastCheckRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_address_key" ON "Address"("address");
