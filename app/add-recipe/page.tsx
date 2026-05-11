import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function addRecipe(formData: FormData) {
  "use server"

  const title = String(formData.get("title") || "")
  const description = String(formData.get("description") || "")
  const imageUrl = String(formData.get("imageUrl") || "")

  const ingredients = String(formData.get("ingredients") || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

  const method = String(formData.get("method") || "")
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean)

  await prisma.recipe.create({
    data: {
      title,
      slug: slugify(title),
      description,
      ingredients,
      method,
      imageUrl,
      calories: Number(formData.get("calories") || 0),
      protein: Number(formData.get("protein") || 0),
      carbs: Number(formData.get("carbs") || 0),
      fats: Number(formData.get("fats") || 0),
      isPublished: true,
    },
  })

  redirect("/recipes")
}

export default function AddRecipePage() {
  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-20 text-[#101010]">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.08em]">
          Add Recipe
        </h1>

        <form action={addRecipe} className="mt-10 grid gap-5">
          <input
            name="title"
            required
            placeholder="Recipe title"
            className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <textarea
            name="description"
            required
            placeholder="Recipe description"
            className="min-h-28 rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <input
            name="imageUrl"
            placeholder="Cloudinary image URL"
            className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <textarea
            name="ingredients"
            required
            placeholder="Ingredients — one per line"
            className="min-h-40 rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <textarea
            name="method"
            required
            placeholder="Method — one step per line"
            className="min-h-40 rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4"
          />

          <div className="grid gap-4 md:grid-cols-4">
            <input
              name="calories"
              type="number"
              placeholder="Calories"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />

            <input
              name="protein"
              type="number"
              placeholder="Protein"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />

            <input
              name="carbs"
              type="number"
              placeholder="Carbs"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />

            <input
              name="fats"
              type="number"
              placeholder="Fats"
              className="rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-white"
          >
            Save Recipe
          </button>
        </form>
      </section>
    </main>
  )
}