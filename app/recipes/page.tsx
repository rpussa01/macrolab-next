import Link from "next/link"
import { prisma } from "../../lib/prisma"


export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany()
  

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>

      <div className="grid gap-6">
        {recipes.map((recipe) => (
         <div key={recipe.id} className="border p-6 rounded-xl">

  <h2 className="text-xl font-bold">{recipe.title}</h2>

  <p>{recipe.description}</p>

  <Link

    href={`/recipes/${recipe.id}`}

    className="inline-block mt-4 bg-black text-white px-4 py-2 rounded"

  >

    View Full Recipe

  </Link>

</div>
        ))}
      </div>
    </main>
    
  )
}
