import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const command = String(body.command || "")
      .trim();

    const lower = command.toLowerCase();

    // DELETE
    if (lower.startsWith("delete ")) {
      const slug = command.replace(/delete\s+/i, "").trim();

      const deletedRecipe = await prisma.recipe.deleteMany({
        where: {
          slug,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Deleted recipe: ${slug}`,
        deletedRecipe,
      });
    }

    // UPDATE
    if (lower.startsWith("update ")) {
      const parts = command.split(" ");

      const slug = parts[1];
      const field = parts[2];
      const value = parts.slice(3).join(" ");

      if (!slug || !field || !value) {
        return NextResponse.json(
          {
            error:
              "Use format: update recipe-slug field value",
          },
          { status: 400 }
        );
      }

      const updatedRecipe = await prisma.recipe.updateMany({
        where: {
          slug,
        },
        data: {
          [field]:
            field === "calories" ||
            field === "protein" ||
            field === "carbs" ||
            field === "fats"
              ? Number(value)
              : value,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Updated ${field} for ${slug}`,
        updatedRecipe,
      });
    }

    // CREATE
    if (lower.startsWith("create ")) {
      const title = command.replace(/create\s+/i, "").trim();

      const slug = makeSlug(title);

      const recipe = await prisma.recipe.create({
        data: {
          title,
          slug,
          description: "AI generated recipe",
          calories: 500,
          protein: 40,
          carbs: 50,
          fats: 15,
          ingredients: [
            "AI generated ingredients",
          ],
          method: [
            "AI generated method",
          ],
          isPublished: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Created recipe: ${title}`,
        recipe,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unsupported command. Use create/update/delete.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong.",
      },
      { status: 500 }
    );
  }
}