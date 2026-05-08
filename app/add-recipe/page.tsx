import { prisma } from "../../lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { v2 as cloudinary } from "cloudinary"


export const dynamic = "force-dynamic"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "macrolab-recipes",
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          resolve(result?.secure_url || "")
        }
      )
      .end(buffer)
  })
}

async function addRecipe(formData: FormData) {
  "use server"

  const imageFile = formData.get("image") as File
  let imageUrl = ""

  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile)
  }

  await prisma.recipe.create({
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      ingredients: String(formData.get("ingredients") || ""),
      method: String(formData.get("method") || ""),
      image: imageUrl,
      calories: Number(formData.get("calories") || 0),
      protein: Number(formData.get("protein") || 0),
      carbs: Number(formData.get("carbs") || 0),
      fat: Number(formData.get("fat") || 0),
    },
  })

  redirect("/manage-recipe")
}

export default async function AddRecipePage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin-auth")?.value === "true"

  if (!isAdmin) {
    redirect("/admin-login")
  }

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
          <input name="title" required placeholder="Recipe title" className="rounded-xl border p-4" />

          <textarea name="description" required placeholder="Short description" className="rounded-xl border p-4" />

          <textarea name="ingredients" required placeholder="Ingredients" rows={8} className="rounded-xl border p-4" />

          <textarea name="method" required placeholder="Method" rows={8} className="rounded-xl border p-4" />

          <input name="image" type="file" accept="image/*" className="rounded-xl border p-4" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <input name="calories" type="number" placeholder="Calories" className="rounded-xl border p-4" />
            <input name="protein" type="number" placeholder="Protein" className="rounded-xl border p-4" />
            <input name="carbs" type="number" placeholder="Carbs" className="rounded-xl border p-4" />
            <input name="fat" type="number" placeholder="Fat" className="rounded-xl border p-4" />
          </div>

          <button
            type="submit"
            className="rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Save Recipe
          </button>
        </form>
      </div>
    </main>
  )
}