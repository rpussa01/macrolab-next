import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json(
        { error: "Command is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.2",
      input: `
Convert this gym command into JSON only.

Command:
${command}

Return:
{
  "programTitle": "string",
  "description": "string",
  "goal": "string",
  "level": "Beginner | Intermediate | Advanced",
  "duration": "string",
  "exercises": [
    {
      "day": "string",
      "name": "string",
      "sets": number,
      "reps": "string",
      "rest": "string",
      "tempo": "string",
      "notes": "string",
      "videoUrl": "string",
      "order": number
    }
  ]
}

Rules:
- Example: "Add 3x15 DB curls to Arm Day" should create/update "Arm Day".
- Use empty string for videoUrl unless the user provides a URL.
- Return valid JSON only.
      `,
    });

    const parsed = JSON.parse(response.output_text);
    const slug = slugify(parsed.programTitle);

    const program = await prisma.trainingProgram.upsert({
      where: { slug },
      update: {
        title: parsed.programTitle,
        description: parsed.description,
        goal: parsed.goal,
        level: parsed.level,
        duration: parsed.duration,
      },
      create: {
        slug,
        title: parsed.programTitle,
        description: parsed.description,
        goal: parsed.goal,
        level: parsed.level,
        duration: parsed.duration,
        isPublished: true,
      },
    });

    const savedExercises = await Promise.all(
      parsed.exercises.map((ex: any) =>
        prisma.exercise.create({
          data: {
            programId: program.id,
            day: ex.day,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest,
            tempo: ex.tempo,
            notes: ex.notes,
            videoUrl: ex.videoUrl,
            order: ex.order ?? 0,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      type: "training",
      item: program,
      exercises: savedExercises,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update training program" },
      { status: 500 }
    );
  }
}