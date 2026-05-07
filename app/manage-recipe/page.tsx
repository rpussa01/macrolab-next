import { prisma } from "../../lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function deleteRecipe(formData: FormData) {
  "use server"

  const id = Number(formData.get("id"))

  if (!id) return

  await prisma.recipe.delete({
    where: { id },
  })

  revalidatePath("/manage-recipe")
  revalidatePath("/recipes")
}

export default async function ManageRecipePage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin-auth")?.value === "true"

  if (!isAdmin) {
    redirect("/admin-login")
  }

  const recipes = await prisma.recipe.findMany({
    orderBy: { id: "desc" },
  })

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between">
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
            className="rounded-full bg-[#08789b] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Add Recipe
          </Link>
        </div>

        <div className="grid gap-6">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="rounded-[2rem] bg-white p-6 shadow-xl"
            >
              <h2 className="text-3xl font-black tracking-[-0.05em]">
                {recipe.title}
              </h2>

              <p className="mt-2 text-black/60">{recipe.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/manage-recipe/${recipe.id}`}
                  className="rounded-full bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
                >
                  Update
                </Link>

                <form action={deleteRecipe}>
                  <input type="hidden" name="id" value={recipe.id} />

                  <button
                    type="submit"
                    className="rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}