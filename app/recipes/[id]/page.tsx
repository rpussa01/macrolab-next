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
  <main className="bg-[#eef2f4] min-h-screen px-6 py-12">
    <div className="max-w-5xl mx-auto">

      {/* HERO IMAGE */}
      {recipe.image && (
        <div className="relative h-[400px] w-full overflow-hidden rounded-[2rem] shadow-xl">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* TITLE */}
      <h1 className="mt-8 text-5xl font-black tracking-tight">
        {recipe.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-4 text-lg text-black/60 max-w-2xl">
        {recipe.description}
      </p>

      {/* MACROS */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-2xl font-bold">260</p>
          <span className="text-sm text-gray-500">kcal</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-2xl font-bold">30g</p>
          <span className="text-sm text-gray-500">protein</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-2xl font-bold">18g</p>
          <span className="text-sm text-gray-500">carbs</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-2xl font-bold">7g</p>
          <span className="text-sm text-gray-500">fat</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-12 grid md:grid-cols-2 gap-10">

        {/* INGREDIENTS */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-black mb-4">Ingredients</h2>
          <p className="whitespace-pre-line text-black/70 leading-relaxed">
            {recipe.ingredients}
          </p>
        </div>

        {/* METHOD */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-black mb-4">Method</h2>
          <p className="whitespace-pre-line text-black/70 leading-relaxed">
            {recipe.method}
          </p>
        </div>

      </div>
    </div>
  </main>
)
}