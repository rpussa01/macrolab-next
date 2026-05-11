import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const { command, type } = await req.json();

    if (!command) {
      return NextResponse.json(
        { error: "Command is required" },
        { status: 400 }
      );
    }

    const lower = command.toLowerCase().trim();

    /*
    =========================================
    TRAINING PROGRAM CRUD
    =========================================
    */

    // UPDATE TRAINING
    if (type === "training" && lower.startsWith("update")) {
      const slugMatch = lower.match(/update\s+([a-z0-9-]+)/);
      const daysMatch = lower.match(/(\d+)\s*days?/);

      if (!slugMatch) {
        return NextResponse.json(
          { error: "Training slug missing" },
          { status: 400 }
        );
      }

      const slug = slugMatch[1];

      const updated = await prisma.trainingProgram.update({
        where: { slug },
        data: {
          ...(daysMatch && {
            duration: `${daysMatch[1]} days`,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Training program updated successfully",
        item: updated,
      });
    }

    // DELETE TRAINING
    if (type === "training" && lower.startsWith("delete")) {
      const slug = lower.replace("delete", "").trim();

      const result = await prisma.trainingProgram.deleteMany({
        where: { slug },
      });

      if (result.count === 0) {
        return NextResponse.json(
          { error: `No training program found: ${slug}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Training program deleted successfully",
      });
    }

    // CREATE TRAINING
    if (type === "training" && lower.startsWith("create")) {
      const title = command.replace(/^create/i, "").trim();

      const slug = slugify(title);

      const created = await prisma.trainingProgram.create({
        data: {
          title,
          slug,
          description: title,
          goal: "Hypertrophy",
          level: "Intermediate",
          duration: "5 days",
          isPublished: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Training program created successfully",
        item: created,
      });
    }

    /*
    =========================================
    RECIPE CRUD
    =========================================
    */

    // DELETE RECIPE
    if (type === "recipe" && lower.startsWith("delete")) {
      const slug = lower.replace("delete", "").trim();

      if (!slug) {
        return NextResponse.json(
          { error: "Recipe slug missing" },
          { status: 400 }
        );
      }

      const result = await prisma.recipe.deleteMany({
        where: { slug },
      });

      if (result.count === 0) {
        return NextResponse.json(
          { error: `No recipe found with slug: ${slug}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Recipe deleted successfully",
      });
    }

    // UPDATE RECIPE
    if (type === "recipe" && lower.startsWith("update")) {
      const slugMatch = lower.match(/update\s+([a-z0-9-]+)/);
      const proteinMatch = lower.match(/protein\s+to\s+(\d+)/);

      if (!slugMatch) {
        return NextResponse.json(
          { error: "Recipe slug missing" },
          { status: 400 }
        );
      }

      const slug = slugMatch[1];

      const updated = await prisma.recipe.update({
        where: { slug },
        data: {
          ...(proteinMatch && {
            protein: Number(proteinMatch[1]),
          }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Recipe updated successfully",
        item: updated,
      });
    }

    // CREATE RECIPE
    if (type === "recipe" && lower.startsWith("create")) {
      const title = command.replace(/^create/i, "").trim();

      const slug = slugify(title);

      const created = await prisma.recipe.create({
        data: {
          title,
          slug,
          description: title,
          calories: 500,
          protein: 40,
          carbs: 50,
          fats: 12,
          ingredients: ["AI generated ingredients"],
          method: ["AI generated method"],
          imageUrl: "",
          isPublished: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Recipe created successfully",
        item: created,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unsupported command. Use create/update/delete commands.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("OPENAI COMMAND ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "OpenAI command failed",
      },
      { status: 500 }
    );
  }
}