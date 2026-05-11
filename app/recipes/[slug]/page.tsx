import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
  });

  if (!recipe || !recipe.isPublished) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="max-h-[900px] w-full rounded-3xl object-contain bg-black"
            />
        )}

        <h1 className="text-4xl font-bold">{recipe.title}</h1>

        <p className="mt-3 text-zinc-400">{recipe.description}</p>

        <div className="mt-8 grid grid-cols-4 gap-3 text-center">
          <div className="rounded-2xl bg-zinc-900 p-4">
            <p className="text-zinc-500">Calories</p>
            <p className="text-2xl font-bold">{recipe.calories}</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4">
            <p className="text-zinc-500">Protein</p>
            <p className="text-2xl font-bold">{recipe.protein}g</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4">
            <p className="text-zinc-500">Carbs</p>
            <p className="text-2xl font-bold">{recipe.carbs}g</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4">
            <p className="text-zinc-500">Fats</p>
            <p className="text-2xl font-bold">{recipe.fats}g</p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-lime-400">Ingredients</h2>

          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((item) => (
              <li key={item} className="rounded-xl bg-zinc-900 p-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-lime-400">Method</h2>

          <ol className="mt-4 space-y-2">
            {recipe.method.map((step, index) => (
              <li key={step} className="rounded-xl bg-zinc-900 p-3">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}