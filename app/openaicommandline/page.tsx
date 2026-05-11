"use client";

import { useState } from "react";

export default function OpenAICommandLinePage() {
  const [command, setCommand] = useState("");
  const [type, setType] = useState("recipe");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function runCommand() {
    setLoading(true);
    setMessage("");

    const endpoint =
      type === "recipe" ? "/api/recipe-ai" : "/api/training-ai";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Command failed");
      setLoading(false);
      return;
    }

    setCommand("");
    setMessage("Command completed successfully.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-4xl font-bold">OpenAI Command Line</h1>

        <p className="mt-3 text-zinc-400">
          Create recipes or training programs from one command box.
        </p>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-8 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        >
          <option value="recipe">Recipe creator</option>
          <option value="training">Training program</option>
        </select>

        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={
            type === "recipe"
              ? "Create a high protein porridge bowl with MacroLab branding"
              : "Add 3x15 DB curls to Arm Day"
          }
          className="mt-6 min-h-52 w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-5 text-white"
        />

        <button
          onClick={runCommand}
          disabled={loading || !command}
          className="mt-6 rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Command"}
        </button>

        {message && (
          <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
