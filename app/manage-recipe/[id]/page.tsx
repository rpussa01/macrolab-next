import { prisma } from "../../../lib/prisma"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function updateRecipe(formData: FormData) {
  "use server"

  const id = Number(formData.get("id"))

  await prisma.recipe.update({
    where: {
      id,
    },
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

  revalidatePath("/recipes")
  revalidatePath("/manage-recipe")
  revalidatePath(`/recipes/${id}`)

  redirect("/manage-recipe")
}

export default async function UpdateRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const cookieStore = await cookies()

  const isAdmin =
    cookieStore.get("admin-auth")?.value === "true"

  if (!isAdmin) {
    redirect("/admin-login")
  }

  const { id } = await params

  const recipeId = Number(id)

  if (isNaN(recipeId)) {
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
    <main className="min-h-screen bg-[#eef2f4] px-6 py-16 text-[#101010]">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-0.06em]">
          Update Recipe
        </h1>

        <form action={updateRecipe} className="mt-10 grid gap-5">
          <input type="hidden" name="id" value={recipe.id} />

          <input
            name="title"
            required
            defaultValue={recipe.title}
            className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
          />

          <textarea
            name="description"
            required
            rows={3}
            defaultValue={recipe.description || ""}
            className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
          />

          <textarea
            name="ingredients"
            required
            rows={8}
            defaultValue={recipe.ingredients}
            className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
          />

          <textarea
            name="method"
            required
            rows={8}
            defaultValue={recipe.method}
            className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
          />

          <input
            name="image"
            defaultValue={recipe.image || ""}
            placeholder="Image URL"
            className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <input
              name="calories"
              type="number"
              defaultValue={recipe.calories || 0}
              placeholder="Calories"
              className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
            />

            <input
              name="protein"
              type="number"
              defaultValue={recipe.protein || 0}
              placeholder="Protein"
              className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
            />

            <input
              name="carbs"
              type="number"
              defaultValue={recipe.carbs || 0}
              placeholder="Carbs"
              className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
            />

            <input
              name="fat"
              type="number"
              defaultValue={recipe.fat || 0}
              placeholder="Fat"
              className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  )
}