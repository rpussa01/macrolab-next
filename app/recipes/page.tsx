import Link from "next/link"
import Image from "next/image"
import { prisma } from "../../lib/prisma"

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      id: "asc",
    },
  })

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-16 text-[#101010]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#08789b]">
            MacroLab Recipes
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-[-0.06em] md:text-7xl">
            High Protein.
            <br />
            Low Regret.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-black/60">
            Premium chef-built recipes designed for cutting, performance, and
            clean cravings.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-72 overflow-hidden bg-[#2b1008]">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-7xl">
                    🍽️
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#08789b]">
                  High Protein Recipe
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                  {recipe.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/60">
                  {recipe.description}
                </p>

                <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-[#eef2f4] p-3">
                    <strong>{recipe.calories}</strong>
                    <p className="text-xs text-black/50">kcal</p>
                  </div>
                  <div className="rounded-xl bg-[#eef2f4] p-3">
                    <strong>{recipe.protein}</strong>
                    <p className="text-xs text-black/50">pro</p>
                  </div>
                  <div className="rounded-xl bg-[#eef2f4] p-3">
                    <strong>{recipe.carbs}</strong>
                    <p className="text-xs text-black/50">carb</p>
                  </div>
                  <div className="rounded-xl bg-[#eef2f4] p-3">
                    <strong>{recipe.fat}</strong>
                    <p className="text-xs text-black/50">fat</p>
                  </div>
                </div>

                <Link
                  href={`/recipes/${recipe.id}`}
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-[#08789b] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#065f79]"
                >
                  View Recipe
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}