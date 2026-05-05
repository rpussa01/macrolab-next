import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "node:path"

const dbPath = path.join(process.cwd(), "prisma", "dev.db")

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.recipe.create({
    data: {
      title: "Chocolate Lava Cake",
      description: "High-protein molten chocolate lava cake",
      ingredients: "1 egg, 20g cocoa powder, 80g Greek yogurt, 20g almond flour, 10g dark chocolate",
      method: "Mix ingredients, add chocolate centre, bake at 180°C for 8–10 minutes.",
      image: "/images/chocolate-lava.png"
    },
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })