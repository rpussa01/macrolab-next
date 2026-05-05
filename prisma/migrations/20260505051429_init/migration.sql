-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "image" TEXT
);
