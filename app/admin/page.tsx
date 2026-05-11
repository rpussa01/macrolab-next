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
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.08em]">
          Dashboard
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-black/60">
          Manage recipes, training programs, AI content generation,
          uploads, and MacroLab platform content.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* OPENAI COMMANDLINE */}
          <Link
            href="admin/openaicommandline"
            className="group rounded-[2rem] bg-[#08789b] p-8 text-white shadow-2xl transition duration-300 hover:-translate-y-2 hover:bg-[#06657f]"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70">
              AI Powered
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-[-0.08em]">
              OpenAI
              <br />
              Commandline
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/80">
              Create, update, publish, or delete recipes and
              training programs using natural language AI commands.
            </p>

            <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm font-bold text-white/90">
              Example:
              <div className="mt-2 text-white/70">
                “Build a 5 day fat loss hypertrophy program for Rasika”
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
              Open AI Console →
            </div>
          </Link>

          {/* ADD RECIPE */}
          <Link
            href="/add-recipe"
            className="rounded-[2rem] bg-white p-8 shadow-xl transition duration-300 hover:-translate-y-2"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
              Content
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
              Add Recipe
            </h2>

            <p className="mt-5 text-black/60">
              Create premium MacroLab recipes with macros,
              ingredients, instructions, and images.
            </p>
          </Link>

          {/* MANAGE RECIPES */}
          <Link
            href="/manage-recipe"
            className="rounded-[2rem] bg-white p-8 shadow-xl transition duration-300 hover:-translate-y-2"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
              Database
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
              Manage Recipes
            </h2>

            <p className="mt-5 text-black/60">
              Edit, update, publish, or delete existing recipes.
            </p>
          </Link>

          {/* TRAINING */}
          <Link
            href="/training"
            className="rounded-[2rem] bg-white p-8 shadow-xl transition duration-300 hover:-translate-y-2"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
              Fitness
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
              Training Programs
            </h2>

            <p className="mt-5 text-black/60">
              View and manage public workout programs.
            </p>
          </Link>

          {/* ANALYTICS */}
          <Link
            href="/admin/stats"
            className="rounded-[2rem] bg-white p-8 shadow-xl transition duration-300 hover:-translate-y-2"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
              Analytics
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
              Stats
            </h2>

            <p className="mt-5 text-black/60">
              Monitor platform performance and engagement.
            </p>
          </Link>

          {/* LOGOUT */}
          <Link
            href="/admin-logout"
            className="rounded-[2rem] bg-[#101010] p-8 text-white shadow-xl transition duration-300 hover:-translate-y-2"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/50">
              Session
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
              Logout
            </h2>

            <p className="mt-5 text-white/70">
              Securely end the current admin session.
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}