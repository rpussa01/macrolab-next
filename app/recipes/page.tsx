import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold tracking-tight">
          MacroLab Recipes
        </h1>

        <p className="mt-3 text-zinc-400">
          High-protein recipes built for performance.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#111111] transition duration-300 hover:border-lime-400 hover:shadow-2xl hover:shadow-lime-500/10"
            >
              {recipe.imageUrl ? (
                <div className="bg-black p-3">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="max-h-[500px] w-full rounded-2xl object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center bg-zinc-900 text-zinc-500">
                  No image
                </div>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-semibold">
                  {recipe.title}
                </h2>

                <p className="mt-3 line-clamp-2 text-zinc-400">
                  {recipe.description}
                </p>

                <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-black p-3">
                    <p className="text-xs text-zinc-500">Cal</p>
                    <p className="font-semibold">
                      {recipe.calories}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black p-3">
                    <p className="text-xs text-zinc-500">Protein</p>
                    <p className="font-semibold">
                      {recipe.protein}g
                    </p>
                  </div>

                  <div className="rounded-xl bg-black p-3">
                    <p className="text-xs text-zinc-500">Carbs</p>
                    <p className="font-semibold">
                      {recipe.carbs}g
                    </p>
                  </div>

                  <div className="rounded-xl bg-black p-3">
                    <p className="text-xs text-zinc-500">Fats</p>
                    <p className="font-semibold">
                      {recipe.fats}g
                    </p>
                  </div>
                </div>

                <p className="mt-6 font-semibold text-lime-400">
                  View recipe →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}