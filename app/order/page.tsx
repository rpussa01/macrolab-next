import { prisma } from "../../lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Resend } from "resend"
import { redirect } from "next/navigation"

async function sendEnquiry(formData: FormData) {
  "use server"

  const resend = new Resend(process.env.RESEND_API_KEY)

  const name = String(formData.get("name") || "")
  const email = String(formData.get("email") || "")
  const goal = String(formData.get("goal") || "")
  const message = String(formData.get("message") || "")

  await resend.emails.send({
    from: "MacroLab <orders@macrolabapp.com>",
    to: "rasika@macrolabapp.com",
    subject: "New MacroLab Order Enquiry",
    replyTo: email,
    html: `
      <h2>New MacroLab Order Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Goal:</strong> ${goal}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  })

  redirect("/order?sent=true")
}

export default async function OrderPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      id: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-16 text-[#101010]">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2.5rem] bg-[#101010] px-8 py-16 text-white shadow-2xl md:px-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#08789b]">
            MacroLab Nutrition
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] md:text-7xl">
            Order High-Protein Meals Online
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
            Clean meals built for performance, recovery, and aesthetics.
          </p>

          <a
            href="#enquiry"
            className="mt-10 inline-flex rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Send Enquiry
          </a>
        </section>

        <section className="mt-16">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
              Featured Meals
            </p>

            <h2 className="mt-3 text-5xl font-black tracking-[-0.06em]">
              Built For Results
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1"
              >
                <div className="relative h-[240px] w-full bg-[#dfe5e8]">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-black/30">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-3xl font-black tracking-[-0.05em]">
                    {recipe.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-black/60">
                    {recipe.description}
                  </p>

                  <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl bg-[#eef2f4] p-3">
                      <strong>{recipe.calories ?? "-"}</strong>
                      <p className="text-xs text-black/50">kcal</p>
                    </div>

                    <div className="rounded-xl bg-[#eef2f4] p-3">
                      <strong>
                        {recipe.protein ? `${recipe.protein}g` : "-"}
                      </strong>
                      <p className="text-xs text-black/50">pro</p>
                    </div>

                    <div className="rounded-xl bg-[#eef2f4] p-3">
                      <strong>{recipe.carbs ? `${recipe.carbs}g` : "-"}</strong>
                      <p className="text-xs text-black/50">carb</p>
                    </div>

                    <div className="rounded-xl bg-[#eef2f4] p-3">
                      <strong>{recipe.fat ? `${recipe.fat}g` : "-"}</strong>
                      <p className="text-xs text-black/50">fat</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="flex-1 rounded-full border border-black/10 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.18em]"
                    >
                      View
                    </Link>

                    <a
                      href="#enquiry"
                      className="flex-1 rounded-full bg-[#101010] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#08789b]"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="enquiry"
          className="mt-20 rounded-[2.5rem] bg-white p-8 shadow-2xl md:p-12"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
                Custom Orders
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-[-0.06em]">
                Build Your Meal Plan
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/60">
                Submit your request and MacroLab will contact you with
                customised meal prep options.
              </p>
            </div>

            <form action={sendEnquiry} className="grid gap-4">
              <input
                name="name"
                required
                placeholder="Full name"
                className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
              />

              <input
                name="email"
                required
                type="email"
                placeholder="Email"
                className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
              />

              <input
                name="goal"
                required
                placeholder="Goal: cut, bulk, maintenance"
                className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
              />

              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell us what meals or macros you want"
                className="rounded-xl border border-black/10 p-4 outline-none focus:border-[#08789b]"
              />

              <button
                type="submit"
                className="rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
              >
                Submit Order Request
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}