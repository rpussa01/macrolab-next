import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

await prisma.admin.upsert({
  where: {
    email: "rasika@macrolabapp.com",
  },
  update: {},
  create: {
    email: "rasika@macrolabapp.com",
    password: "admin123",
    name: "Rasika",
  },
})