import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function updateRecipe(id: string, formData: FormData) {
  "use server"

  const imageUrl = String(formData.get("imageUrl") || "")

  await prisma.recipe.update({
    where: { id },
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),

      ingredients: String(formData.get("ingredients") || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      method: String(formData.get("method") || "")
        .split("\n")
        .map((step) => step.trim())
        .filter(Boolean),

      imageUrl,

      calories: Number(formData.get("calories") || 0),
      protein: Number(formData.get("protein") || 0),
      carbs: Number(formData.get("carbs") || 0),
      fats: Number(formData.get("fats") || 0),
    },
  })

  redirect("/manage-recipe")
}

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  })

  if (!recipe) {
    redirect("/manage-recipe")
  }

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-20 text-[#101010]">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.08em]">
          Edit Recipe
        </h1>

        <form action={updateRecipe.bind(null, recipe.id)} className="mt-10 grid gap-5">
          <input
            name="title"
            defaultValue={recipe.title}
            required
            placeholder="Recipe title"
            className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <textarea
            name="description"
            defaultValue={recipe.description}
            required
            placeholder="Recipe description"
            className="min-h-28 rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <input
            name="imageUrl"
            defaultValue={recipe.imageUrl || ""}
            placeholder="Cloudinary image URL"
            className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <textarea
            name="ingredients"
            defaultValue={recipe.ingredients.join("\n")}
            required
            placeholder="Ingredients — one per line"
            className="min-h-40 rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <textarea
            name="method"
            defaultValue={recipe.method.join("\n")}
            required
            placeholder="Method — one step per line"
            className="min-h-40 rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <div className="grid gap-4 md:grid-cols-4">
            <input
              name="calories"
              type="number"
              defaultValue={recipe.calories || 0}
              placeholder="Calories"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />

            <input
              name="protein"
              type="number"
              defaultValue={recipe.protein || 0}
              placeholder="Protein"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />

            <input
              name="carbs"
              type="number"
              defaultValue={recipe.carbs || 0}
              placeholder="Carbs"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />

            <input
              name="fats"
              type="number"
              defaultValue={recipe.fats || 0}
              placeholder="Fats"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-white"
          >
            Update Recipe
          </button>
        </form>
      </section>
    </main>
  )
}