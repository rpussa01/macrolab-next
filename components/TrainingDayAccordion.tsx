"use client";

import { useState } from "react";

export default function TrainingDayAccordion({ grouped }: { grouped: any }) {
  const [openDay, setOpenDay] = useState<string | null>(
    Object.keys(grouped)[0] || null
  );

  return (
    <div className="mt-10 space-y-4">
      {Object.entries(grouped).map(([day, exercises]: any) => {
        const isOpen = openDay === day;

        return (
          <section
            key={day}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
          >
            <button
              onClick={() => setOpenDay(isOpen ? null : day)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <h2 className="text-2xl font-bold text-lime-400">{day}</h2>
              <span className="text-2xl">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-zinc-800 p-5">
                {exercises.map((exercise: any) => (
                  <div
                    key={exercise.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                  >
                    <h3 className="text-xl font-semibold">
                      {exercise.name}
                    </h3>

                    <p className="mt-2 text-zinc-300">
                      {exercise.sets} sets × {exercise.reps}
                    </p>

                    <div className="mt-2 space-y-1 text-sm text-zinc-500">
                      {exercise.rest && <p>Rest: {exercise.rest}</p>}
                      {exercise.tempo && <p>Tempo: {exercise.tempo}</p>}
                      {exercise.notes && <p>Notes: {exercise.notes}</p>}
                    </div>

                    {exercise.videoUrl && (
                      <a
                        href={exercise.videoUrl}
                        target="_blank"
                        className="mt-4 inline-block font-semibold text-lime-400 underline"
                      >
                        Watch exercise video
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}