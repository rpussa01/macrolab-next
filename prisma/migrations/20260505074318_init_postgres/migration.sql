-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
