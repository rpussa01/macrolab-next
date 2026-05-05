import Link from "next/link"
import Image from "next/image"
import { prisma } from "../lib/prisma"

export default async function MacroLabHome() {
  const featuredRecipe = await prisma.recipe.findFirst({
    orderBy: {
      id: "asc",
    },
  })

  return (
    <main className="min-h-screen bg-[#dfe5e8] text-[#101010]">
      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden bg-[#e8edf0]">
        <aside className="absolute right-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-center gap-12 bg-[#c9ced6] shadow-2xl md:flex">
          <Link href="#about" className="text-3xl">
            ☻
          </Link>

          <Link href="/recipes" className="relative text-3xl">
            🍽️
            <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#f15b2a] text-xs font-black text-white">
              1
            </span>
          </Link>
        </aside>

        <section className="relative z-20 mx-auto grid min-h-[calc(100vh-140px)] max-w-7xl place-items-center px-6 pb-20 pt-12 md:pt-16 text-center">
          <div className="relative w-full">
            <h2 className="relative z-10 mb-6 text-[18vw] font-black uppercase leading-[0.75] tracking-[-0.08em] text-[#08789b] drop-shadow-[4px_6px_0_rgba(0,0,0,0.1)] md:mb-10 md:text-[9rem] lg:text-[11rem]">
              Healthy Pro
            </h2>

            <div className="absolute left-1/2 top-[48%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cdd3da] md:h-[560px] md:w-[560px]" />

            <div className="relative z-20 mx-auto mt-10 flex h-[430px] w-[280px] flex-col items-center justify-end rounded-[2.5rem] bg-gradient-to-b from-[#111] via-[#111] to-[#050505] shadow-[0_35px_80px_rgba(0,0,0,0.35)] md:mt-16 md:h-[520px] md:w-[340px]">
              <div className="absolute -top-8 h-20 w-[92%] rounded-b-xl rounded-t-3xl bg-[#111] shadow-xl">
                <div className="mt-3 h-4 w-full bg-white/10" />
                <div className="mt-3 h-3 w-full bg-white/10" />
              </div>

              <div className="absolute top-16 w-full bg-[#0a83a7] py-8 text-white">
                <div className="text-2xl font-black uppercase tracking-[0.32em]">
                  MacroLab
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] opacity-80">
                  Healthy Protein Recipes
                </div>
              </div>

              <div className="relative z-10 mb-28 px-6 text-left text-white">
                <div className="text-5xl font-black uppercase tracking-[-0.08em] md:text-6xl">
                  100% Whey
                </div>
                <p className="mt-5 max-w-[260px] text-xs font-bold uppercase leading-relaxed tracking-[0.12em] text-white/70">
                  Protein recipes • Macro meals • High protein desserts
                </p>
              </div>

              <div className="absolute bottom-8 h-10 w-[78%] rounded-full bg-white/10 blur-sm" />
            </div>

            <p className="relative z-30 mt-10 text-xl font-black uppercase tracking-[0.58em] md:text-3xl">
              Professional Recipes
            </p>

            <div className="relative z-30 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/recipes"
                className="rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl transition hover:bg-[#065f79]"
              >
                View Recipes
              </Link>

              <Link
                href="#about"
                className="rounded-full border border-black/20 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#101010] transition hover:border-[#08789b] hover:text-[#08789b]"
              >
                My Story
              </Link>
            </div>
          </div>
        </section>
      </section>

      {/* FEATURED RECIPE SECTION */}
      {featuredRecipe && (
        <section className="bg-[#dfe5e8] px-6 py-20 md:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#0a83a7]">
                  From the database
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] md:text-6xl">
                  Featured Recipe
                </h2>
              </div>

              <Link href="/recipes" className="font-black text-[#08789b]">
                See all recipes →
              </Link>
            </div>

            <div className="grid gap-8 rounded-[2.5rem] bg-white p-6 shadow-2xl md:grid-cols-[0.9fr_1.1fr] md:p-8">
              <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] bg-[#2b1008] shadow-inner">
                {featuredRecipe.image ? (
                  <Image
                    src={featuredRecipe.image}
                    alt={featuredRecipe.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-8xl">
                    🍫
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center p-2 md:p-6">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#08789b]">
                  High Protein Dessert
                </p>

                <h3 className="mt-3 text-4xl font-black tracking-[-0.06em] md:text-6xl">
                  {featuredRecipe.title}
                </h3>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/60">
                  {featuredRecipe.description}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-[#e8edf0] p-5">
                    <strong className="text-2xl">{featuredRecipe.calories}</strong>
                    <p className="text-sm text-black/50">kcal</p>
                  </div>
                  <div className="rounded-2xl bg-[#e8edf0] p-5">
                    <strong className="text-2xl">{featuredRecipe.protein}g</strong>
                    <p className="text-sm text-black/50">protein</p>
                  </div>
                  <div className="rounded-2xl bg-[#e8edf0] p-5">
                    <strong className="text-2xl">{featuredRecipe.carbs}g</strong>
                    <p className="text-sm text-black/50">carbs</p>
                  </div>
                  <div className="rounded-2xl bg-[#e8edf0] p-5">
                    <strong className="text-2xl">{featuredRecipe.fat}g</strong>
                    <p className="text-sm text-black/50">fat</p>
                  </div>
                </div>

                <Link
                  href={`/recipes/${featuredRecipe.id}`}
                  className="mt-8 inline-flex w-fit rounded-full bg-[#08789b] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
                >
                  View Full Recipe
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      <section id="about" className="bg-[#dfe5e8] px-6 py-24 md:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#0a83a7]">
              Founder Story
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#101010] md:text-6xl">
              Chef discipline.
              <br />
              Athlete intensity.
              <br />
              Tech mindset.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-black/70">
              I’m a professional chef with years of hands-on kitchen experience,
              combining culinary creativity with high-performance nutrition.
              MacroLab is built around recipes that look premium, taste elite,
              and support real physique goals.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-black/70">
              My training intensity is disciplined, consistent, and focused on
              aesthetics, performance, and long-term progression.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-black/70">
              I also have a background in Software Engineering and Information
              Technology, blending food, fitness, and systems into one brand.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-black/70">
              Before that, boxing shaped my mindset — I was a boxing champion in
              Sri Lanka, which built my discipline, resilience, and competitive
              edge.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#101010] p-8 text-white shadow-2xl">
            <div className="rounded-[1.5rem] bg-[#0a83a7] p-8">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/70">
                MacroLab Identity
              </p>

              <h3 className="mt-6 text-5xl font-black tracking-[-0.07em]">
                Build food for the cut.
              </h3>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/15 p-5">
                  <strong className="text-3xl">Chef</strong>
                  <p className="mt-1 text-sm text-white/70">Experience</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-5">
                  <strong className="text-3xl">IT</strong>
                  <p className="mt-1 text-sm text-white/70">Education</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-5">
                  <strong className="text-3xl">Gym</strong>
                  <p className="mt-1 text-sm text-white/70">Intensity</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-5">
                  <strong className="text-3xl">Boxing</strong>
                  <p className="mt-1 text-sm text-white/70">Champion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}