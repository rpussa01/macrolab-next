import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.recipe.deleteMany()

  await prisma.recipe.create({
    data: {
      title: "Chocolate Lava Protein Cake",
      description:
        "A macro-friendly chocolate dessert built for cutting, content, and clean high-protein cravings.",
      ingredients:
        "1 egg, cocoa powder, Greek yogurt, almond flour, dark chocolate",
      method:
        "Mix ingredients, add chocolate centre, bake at 180°C for 8–10 minutes.",
      image: "/images/chocolate-lava.png",
    },
  })

  console.log("Seed completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })