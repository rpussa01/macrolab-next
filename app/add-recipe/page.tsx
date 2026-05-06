import { prisma } from "../../lib/prisma"
import { redirect } from "next/navigation"
import { writeFile } from "fs/promises"
import path from "path"

async function addRecipe(formData: FormData) {
  "use server"

  const imageFile = formData.get("image") as File

  let imagePath = ""

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${Date.now()}-${imageFile.name.replaceAll(" ", "-")}`
    const uploadPath = path.join(process.cwd(), "public", "images", fileName)

    await writeFile(uploadPath, buffer)

    imagePath = `/images/${fileName}`
  }

  await prisma.recipe.create({
    data: {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      ingredients: String(formData.get("ingredients")),
      method: String(formData.get("method")),
      image: imagePath,
      calories: Number(formData.get("calories")),
      protein: Number(formData.get("protein")),
      carbs: Number(formData.get("carbs")),
      fat: Number(formData.get("fat")),
    },
  })

  redirect("/recipes")
}

export default function AddRecipePage() {
  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-0.06em]">
          Add Recipe
        </h1>

        <form action={addRecipe} className="mt-10 grid gap-5">
          <input
            name="title"
            placeholder="Recipe title"
            required
            className="rounded-xl border p-4"
          />

          <textarea
            name="description"
            placeholder="Short description"
            required
            className="rounded-xl border p-4"
          />

          <textarea
            name="ingredients"
            placeholder="Ingredients"
            required
            rows={8}
            className="rounded-xl border p-4"
          />

          <textarea
            name="method"
            placeholder="Method"
            required
            rows={8}
            className="rounded-xl border p-4"
          />

          <input
            name="image"
            type="file"
            accept="image/*"
            className="rounded-xl border p-4"
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <input name="calories" type="number" placeholder="Calories" className="rounded-xl border p-4" />
            <input name="protein" type="number" placeholder="Protein" className="rounded-xl border p-4" />
            <input name="carbs" type="number" placeholder="Carbs" className="rounded-xl border p-4" />
            <input name="fat" type="number" placeholder="Fat" className="rounded-xl border p-4" />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Save Recipe
          </button>
        </form>
      </div>
    </main>
  )
}