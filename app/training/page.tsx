import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TrainingProgramsPage() {
  const programs = await prisma.trainingProgram.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <h1 className="text-4xl font-bold">Training Programs</h1>

      <p className="mt-3 text-zinc-400">
        Choose a program and follow the full workout plan.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={`/training/${program.slug}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-lime-400"
          >
            <h2 className="text-2xl font-semibold">{program.title}</h2>

            <p className="mt-3 text-zinc-400">{program.description}</p>

            <div className="mt-5 space-y-1 text-sm text-zinc-500">
              <p>Goal: {program.goal}</p>
              <p>Level: {program.level}</p>
              <p>Duration: {program.duration}</p>
            </div>

            <p className="mt-5 font-semibold text-lime-400">
              View program →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}