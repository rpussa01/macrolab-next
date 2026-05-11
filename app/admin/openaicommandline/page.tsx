"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "recipe" | "training" | "crud";

export default function OpenAICommandLinePage() {
  const [command, setCommand] = useState("");
  const [mode, setMode] = useState<Mode>("recipe");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  async function runCommand() {
    try {
      setLoading(true);
      setMessage("");
      setResultUrl("");

      const endpoint =
        mode === "recipe"
          ? "/api/recipe-ai"
          : mode === "training"
          ? "/api/training-ai"
          : "/api/openaicommandline";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          type: mode,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Command failed");
        return;
      }

      setCommand("");
      setMessage(data.message || "Command completed successfully.");

      const slug =
        data.recipe?.slug ||
        data.program?.slug ||
        data.item?.slug ||
        data.savedRecipe?.slug ||
        data.savedProgram?.slug;

      if (slug) {
        if (mode === "recipe") setResultUrl(`/recipes/${slug}`);
        if (mode === "training") setResultUrl(`/training/${slug}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-[#08789b] hover:text-[#08789b]"
          >
            ← Admin Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-lime-400 hover:text-lime-400"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 to-black shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 bg-[#08789b] px-8 py-8">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">
              MacroLab AI System
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-[-0.08em] text-white">
              OpenAI Command Line
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
              Create recipes, create training programs, or run CRUD commands
              against existing MacroLab content.
            </p>
          </div>

          <div className="p-8">
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-white/60">
              Command Mode
            </label>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition focus:border-[#08789b]"
            >
              <option value="recipe">Create Recipe + AI Image</option>
              <option value="training">Create Training Program</option>
              <option value="crud">CRUD Existing Content</option>
            </select>

            <div className="mt-8">
              <label className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-white/60">
                AI Command
              </label>

              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={
                  mode === "recipe"
                    ? "Create a MacroLab high-protein chocolate oats bowl with whey, banana, YoPRO and berries. Generate a cinematic food photo and upload it to Cloudinary."
                    : mode === "training"
                    ? "Create a public training program called My Current Push Pull Split with 5 days of hypertrophy training."
                    : 'Delete recipe "macro-lab-vanilla-blueberry-protein-muffins" or update training "my-current-push-pull-split" duration to 6 weeks.'
                }
                className="min-h-[260px] w-full rounded-[2rem] border border-white/10 bg-black p-6 text-lg text-white outline-none transition focus:border-lime-400"
              />
            </div>

            <button
              onClick={runCommand}
              disabled={loading || !command}
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-lime-400 px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:scale-[1.02] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Running Command..." : "Execute Command"}
            </button>

            {message && (
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/60 p-6">
                <p className="text-lg font-semibold text-white">{message}</p>

                {resultUrl && (
                  <a
                    href={resultUrl}
                    className="mt-5 inline-flex rounded-full bg-[#08789b] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#06657f]"
                  >
                    View Page →
                  </a>
                )}
              </div>
            )}

            <div className="mt-12 rounded-[2rem] border border-white/10 bg-black/40 p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-400">
                Example Commands
              </p>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-white/5 p-5 text-sm text-white/80">
                  Create Recipe: Create a MacroLab high-protein tiramisu
                  overnight oats recipe with cinematic black-background food
                  photography.
                </div>

                <div className="rounded-2xl bg-white/5 p-5 text-sm text-white/80">
                  Create Training Program: Create a 6-day aesthetic hypertrophy
                  program and publish it publicly.
                </div>

                <div className="rounded-2xl bg-white/5 p-5 text-sm text-white/80">
                  CRUD: Delete recipe "macro-lab-high-protein-lava-cake" or
                  update training "my-current-push-pull-split" duration to 6
                  weeks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}