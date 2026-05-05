import { prisma } from "../../../lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
    <main className="min-h-screen bg-[#eef2f4] px-6 py-12 text-[#101010]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/recipes"
          className="mb-8 inline-flex text-sm font-black uppercase tracking-[0.18em] text-[#08789b]"
        >
          ← Back to recipes
        </Link>

        {recipe.image && (
          <div className="relative h-[420px] w-full overflow-hidden rounded-[2.5rem] bg-black shadow-2xl">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/25" />
          </div>
        )}

        <section className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
            MacroLab Recipe
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[-0.06em] md:text-7xl">
            {recipe.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-black/60">
            {recipe.description}
          </p>
        </section>

        <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
            <strong className="text-3xl">{recipe.calories ?? "-"}</strong>
            <p className="mt-1 text-sm text-black/50">kcal</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
            <strong className="text-3xl">
              {recipe.protein ? `${recipe.protein}g` : "-"}
            </strong>
            <p className="mt-1 text-sm text-black/50">protein</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
            <strong className="text-3xl">
              {recipe.carbs ? `${recipe.carbs}g` : "-"}
            </strong>
            <p className="mt-1 text-sm text-black/50">carbs</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
            <strong className="text-3xl">
              {recipe.fat ? `${recipe.fat}g` : "-"}
            </strong>
            <p className="mt-1 text-sm text-black/50">fat</p>
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              Ingredients
            </h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-black/70">
              {recipe.ingredients}
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-3xl font-black tracking-[-0.04em]">
              Method
            </h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-black/70">
              {recipe.method}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}