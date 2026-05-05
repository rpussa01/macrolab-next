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
       calories: 260,
        protein: 30,
        carbs: 18,
        fat: 7,
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
  await prisma.recipe.create({
  data: {
    calories: 520,
    protein: 45,
    carbs: 35,
    fat: 18,
    title: "MacroLab Beef Protein Bowl",
    description:
      "Lean high-protein beef bowl built for cutting, performance, and clean macro tracking.",
    ingredients: `
180g lean beef mince (5% fat)
80g cooked rice
50g avocado
50g spinach
50g mushrooms
1 clove garlic
1 tsp olive oil
Salt & pepper

Sauce:
1 tbsp Greek yogurt
1 tsp mustard
1 tsp lemon juice
`,
    method: `
1. Heat pan with olive oil.
2. Add garlic, then beef. Cook until browned.
3. Add mushrooms and spinach, cook until soft.
4. Cook rice separately.
5. Mix yogurt, mustard, and lemon for sauce.
6. Plate rice, beef, veg, avocado.
7. Drizzle sauce on top.
`,
    image: "/images/beef-bowl.png", // optional (add image later)
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