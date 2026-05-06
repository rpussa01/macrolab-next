import { prisma } from "../../lib/prisma"
import Link from "next/link"
import { revalidatePath } from "next/cache"

async function updateRecipe(formData: FormData) {
  "use server"

  const id = Number(formData.get("id"))

  if (!id) return

  await prisma.recipe.update({
    where: { id },
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      ingredients: String(formData.get("ingredients") || ""),
      method: String(formData.get("method") || ""),
      image: String(formData.get("image") || ""),
      calories: Number(formData.get("calories") || 0),
      protein: Number(formData.get("protein") || 0),
      carbs: Number(formData.get("carbs") || 0),
      fat: Number(formData.get("fat") || 0),
    },
  })

  revalidatePath("/manage-recipes")
  revalidatePath("/recipes")
}

async function deleteRecipe(formData: FormData) {
  "use server"

  const id = Number(formData.get("id"))

  if (!id) return

  await prisma.recipe.delete({
    where: { id },
  })

  revalidatePath("/manage-recipes")
  revalidatePath("/recipes")
}

export default async function ManageRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { id: "asc" },
  })

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
              MacroLab Admin
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-[-0.06em]">
              Manage Recipes
            </h1>
          </div>

          <Link
            href="/add-recipe"
            className="w-fit rounded-full bg-[#08789b] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Add Recipe
          </Link>
        </div>

        <div className="grid gap-8">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="rounded-[2rem] bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">
                  Recipe #{recipe.id}
                </p>

                <Link
                  href={`/recipes/${recipe.id}`}
                  className="text-sm font-black uppercase tracking-[0.18em] text-[#08789b]"
                >
                  View
                </Link>
              </div>

              <form action={updateRecipe} className="grid gap-4">
                <input type="hidden" name="id" value={recipe.id} />

                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                    Title
                  </span>
                  <input
                    name="title"
                    defaultValue={recipe.title}
                    className="rounded-xl border border-black/10 p-4 text-xl font-bold outline-none focus:border-[#08789b]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                    Description
                  </span>
                  <textarea
                    name="description"
                    defaultValue={recipe.description ?? ""}
                    rows={3}
                    className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                    Ingredients
                  </span>
                  <textarea
                    name="ingredients"
                    defaultValue={recipe.ingredients}
                    rows={6}
                    className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                    Method
                  </span>
                  <textarea
                    name="method"
                    defaultValue={recipe.method}
                    rows={6}
                    className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                    Image path
                  </span>
                  <input
                    name="image"
                    defaultValue={recipe.image ?? ""}
                    placeholder="/images/recipe.png"
                    className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                      Calories
                    </span>
                    <input
                      name="calories"
                      type="number"
                      defaultValue={recipe.calories ?? 0}
                      className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                      Protein
                    </span>
                    <input
                      name="protein"
                      type="number"
                      defaultValue={recipe.protein ?? 0}
                      className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                      Carbs
                    </span>
                    <input
                      name="carbs"
                      type="number"
                      defaultValue={recipe.carbs ?? 0}
                      className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                      Fat
                    </span>
                    <input
                      name="fat"
                      type="number"
                      defaultValue={recipe.fat ?? 0}
                      className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-fit rounded-full bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
                >
                  Update Recipe
                </button>
              </form>

              <form action={deleteRecipe} className="mt-4">
                <input type="hidden" name="id" value={recipe.id} />

                <button
                  type="submit"
                  className="rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
                >
                  Delete Recipe
                </button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
