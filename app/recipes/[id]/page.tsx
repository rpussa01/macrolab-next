import { prisma } from "../../../lib/prisma"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params
  const recipeId = Number(id)

  if (Number.isNaN(recipeId)) {
    notFound()
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  })

  if (!recipe) {
    notFound()
  }

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
      <p className="text-gray-600 mb-6">{recipe.description}</p>

      <h2 className="text-2xl font-bold mt-6 mb-2">Ingredients</h2>
      <p className="whitespace-pre-line">{recipe.ingredients}</p>

      <h2 className="text-2xl font-bold mt-6 mb-2">Method</h2>
      <p className="whitespace-pre-line">{recipe.method}</p>
      <p>ID: {String(recipe.id)}</p>
    </main>
  )
}