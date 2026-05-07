import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin-auth")?.value === "true"

  if (!isAdmin) {
    redirect("/admin-login")
  }

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-20 text-[#101010]">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.08em]">
          Dashboard
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-black/60">
          Manage recipes, uploads, macros, and MacroLab content.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/add-recipe"
            className="rounded-[2rem] bg-white p-8 shadow-xl transition hover:-translate-y-1"
          >
            <h2 className="text-4xl font-black tracking-[-0.06em]">
              Add Recipe
            </h2>
            <p className="mt-4 text-black/60">
              Create a new recipe with image, macros, ingredients, and method.
            </p>
          </Link>

          <Link
            href="/manage-recipe"
            className="rounded-[2rem] bg-white p-8 shadow-xl transition hover:-translate-y-1"
          >
            <h2 className="text-4xl font-black tracking-[-0.06em]">
              Manage Recipes
            </h2>
            <p className="mt-4 text-black/60">
              Update or delete existing recipes.
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}