import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrainingDayAccordion from "@/components/TrainingDayAccordion";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TrainingProgramPage({ params }: PageProps) {
  const { slug } = await params;

  const program = await prisma.trainingProgram.findUnique({
    where: { slug },
    include: {
      exercises: {
        orderBy: [{ day: "asc" }, { order: "asc" }],
      },
    },
  });

  if (!program || !program.isPublished) {
    notFound();
  }

  const grouped = program.exercises.reduce<
    Record<string, typeof program.exercises>
  >((acc, exercise) => {
    if (!acc[exercise.day]) {
      acc[exercise.day] = [];
    }

    acc[exercise.day].push(exercise);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-lime-400">
          MacroLab Training
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">
          {program.title}
        </h1>

        {program.description && (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-400">
            {program.description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {program.goal && (
            <span className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300">
              Goal: {program.goal}
            </span>
          )}

          {program.level && (
            <span className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300">
              Level: {program.level}
            </span>
          )}

          {program.duration && (
            <span className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300">
              Duration: {program.duration}
            </span>
          )}
        </div>

        <TrainingDayAccordion grouped={grouped} />
      </div>
    </main>
  );
}