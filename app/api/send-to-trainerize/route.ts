import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function extractQuoted(text: string) {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const command = String(body.command || body.prompt || "");

    const quoted = extractQuoted(command);

    const slug = body.slug || quoted[0];
    const clientName = body.clientName || quoted[1] || "Client";

    const emailMatch = command.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    const clientEmail = body.clientEmail || emailMatch?.[0];

    if (!slug || !clientEmail) {
      return NextResponse.json(
        {
          error:
            'Missing program slug or client email. Example: Send training program "my-current-push-pull-split" to Trainerize client "Rasika Bandara" using email "rasikabandaratraining@gmail.com".',
        },
        { status: 400 }
      );
    }

    const program = await prisma.trainingProgram.findUnique({
      where: { slug },
      include: {
        exercises: {
          orderBy: [{ day: "asc" }, { order: "asc" }],
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: `Program not found: ${slug}` },
        { status: 404 }
      );
    }

    const zapierUrl = process.env.ZAPIER_TRAINERIZE_WEBHOOK_URL;

    if (!zapierUrl) {
      return NextResponse.json(
        { error: "Missing ZAPIER_TRAINERIZE_WEBHOOK_URL in .env.local" },
        { status: 500 }
      );
    }

    const zapierRes = await fetch(zapierUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName,
        clientEmail,
        programTitle: program.title,
        programSlug: program.slug,
        goal: program.goal,
        level: program.level,
        duration: program.duration,
        description: program.description,
        exercises: program.exercises,
        visibility: "private",
      }),
    });

    return NextResponse.json({
      success: true,
      message: `Program sent to Zapier/Trainerize for ${clientName}.`,
      zapierStatus: zapierRes.status,
      item: program,
    });
  } catch (error: any) {
    console.error("SEND TO TRAINERIZE ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to send to Trainerize." },
      { status: 500 }
    );
  }
}