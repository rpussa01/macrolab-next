import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function deleteRecipe(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.recipe.delete({
    where: { id },
  });

  revalidatePath("/manage-recipe");
}

export default async function ManageRecipePage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#eef2f4] px-6 py-20 text-[#101010]">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#08789b]">
          MacroLab Admin
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.08em]">
          Manage Recipes
        </h1>

        <div className="mt-12 grid gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-xl md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-3xl font-black tracking-[-0.06em]">
                  {recipe.title}
                </h2>

                <p className="mt-2 text-black/60">
                  {recipe.description}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/manage-recipe/${recipe.id}`}
                  className="rounded-full bg-[#08789b] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
                >
                  Edit
                </Link>

                <form action={deleteRecipe}>
                  <input
                    type="hidden"
                    name="id"
                    value={recipe.id}
                  />

                  <button
                    type="submit"
                    className="rounded-full bg-red-500 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}