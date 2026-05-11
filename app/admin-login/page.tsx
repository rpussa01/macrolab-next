import { prisma } from "../../lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

async function login(formData: FormData) {
  "use server"

  const email = String(formData.get("email") || "")
  const password = String(formData.get("password") || "")

  const admin = await prisma.admin.findFirst({
    where: {
      email,
      password,
    },
    
  })

  if (!admin) {
    console.log("DATABASE ADMIN:", admin);

console.log("FORM EMAIL:", email);

console.log("FORM PASSWORD:", password);
    redirect("/admin-login?error=true")
  }
  console.log("DATABASE ADMIN:", admin);

console.log("FORM EMAIL:", email);

console.log("FORM PASSWORD:", password);

  const cookieStore = await cookies()

  cookieStore.set("admin-auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  redirect("/admin")
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-20">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-10 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Nutrition
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.08em] text-[#101010]">
          Admin Login
        </h1>

        <p className="mt-5 text-base leading-relaxed text-black/60">
          Access the MacroLab admin dashboard to manage
          recipes, uploads, and orders.
        </p>

        {params.error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-100 px-5 py-4 text-sm font-bold text-red-700">
            Invalid email or password
          </div>
        )}

        <form action={login} className="mt-10 grid gap-5">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-black/50">
              Email
            </label>

            <input
              name="email"
              type="email"
              required
              placeholder="rasika@macrolabapp.com"
              className="w-full rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4 outline-none transition focus:border-[#08789b]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-black/50">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl border border-black/10 bg-[#f7f7f7] px-5 py-4 outline-none transition focus:border-[#08789b]"
            />
          </div>
          <button
            type="submit"
            className="mt-3 rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:scale-[1.02]"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}