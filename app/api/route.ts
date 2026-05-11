import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { slugify } from "@/lib/slugify";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
    }

    const intentResponse = await openai.responses.create({
      model: "gpt-5.2",
      input: `
Convert this admin command into JSON only.

Command:
${command}

Return:
{
  "action": "create" | "read" | "update" | "delete",
  "type": "recipe" | "training",
  "slug": "string",
  "data": {}
}

Rules:
- If user says show/list/get all, action is read.
- If user asks for a recipe, type is recipe.
- If user asks for workout/training/program/exercise, type is training.
- For delete/update, create slug from the title/name.
- Return JSON only.
      `,
    });

    const intent = JSON.parse(cleanJson(intentResponse.output_text));

    // READ RECIPES
    if (intent.action === "read" && intent.type === "recipe") {
      const recipes = await prisma.recipe.findMany({
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        message: "Recipes found",
        items: recipes,
      });
    }

    // READ TRAINING
    if (intent.action === "read" && intent.type === "training") {
      const programs = await prisma.trainingProgram.findMany({
        include: { exercises: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        message: "Training programs found",
        items: programs,
      });
    }

    // DELETE RECIPE
    if (intent.action === "delete" && intent.type === "recipe") {
      const deleted = await prisma.recipe.delete({
        where: { slug: intent.slug },
      });

      return NextResponse.json({
        success: true,
        message: "Recipe deleted",
        item: deleted,
      });
    }

    // DELETE TRAINING
    if (intent.action === "delete" && intent.type === "training") {
      const deleted = await prisma.trainingProgram.delete({
        where: { slug: intent.slug },
      });

      return NextResponse.json({
        success: true,
        message: "Training program deleted",
        item: deleted,
      });
    }

    // UPDATE RECIPE
    if (intent.action === "update" && intent.type === "recipe") {
      const updated = await prisma.recipe.update({
        where: { slug: intent.slug },
        data: intent.data,
      });

      return NextResponse.json({
        success: true,
        message: "Recipe updated",
        item: updated,
      });
    }

    // UPDATE TRAINING PROGRAM
    if (intent.action === "update" && intent.type === "training") {
      const updated = await prisma.trainingProgram.update({
        where: { slug: intent.slug },
        data: intent.data,
      });

      return NextResponse.json({
        success: true,
        message: "Training program updated",
        item: updated,
      });
    }

    // CREATE RECIPE
    if (intent.action === "create" && intent.type === "recipe") {
      const recipeResponse = await openai.responses.create({
        model: "gpt-5.2",
        input: `
Create a MacroLab high-protein recipe from this command:

${command}

Return JSON only:
{
  "title": "string",
  "description": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "ingredients": ["string"],
  "method": ["string"],
  "imagePrompt": "string"
}
        `,
      });

      const recipe = JSON.parse(cleanJson(recipeResponse.output_text));

      const imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `
Create a premium fitness food photograph.

Recipe:
${recipe.title}

Style:
- ultra realistic food photography
- dark moody black background
- cinematic lighting
- premium gym nutrition aesthetic
- modern plating
- high contrast
- no text
- no words
- no logos
- no labels
- no watermarks

Extra direction:
${recipe.imagePrompt}
        `,
        size: "1536x1024",
      });

      const base64Image = imageResponse.data?.[0]?.b64_json;

      if (!base64Image) {
        throw new Error("Image generation failed");
      }

      const upload = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64Image}`,
        {
          folder: "macrolab/recipes",
          resource_type: "image",
          public_id: `${slugify(recipe.title)}-${Date.now()}`,
        }
      );

      const savedRecipe = await prisma.recipe.upsert({
        where: { slug: slugify(recipe.title) },
        update: {
          title: recipe.title,
          description: recipe.description,
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fats: recipe.fats,
          ingredients: recipe.ingredients,
          method: recipe.method,
          imageUrl: upload.secure_url,
          publicId: upload.public_id,
          isPublished: true,
        },
        create: {
          slug: slugify(recipe.title),
          title: recipe.title,
          description: recipe.description,
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fats: recipe.fats,
          ingredients: recipe.ingredients,
          method: recipe.method,
          imageUrl: upload.secure_url,
          publicId: upload.public_id,
          isPublished: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Recipe created with image",
        item: savedRecipe,
      });
    }

    // CREATE TRAINING
    if (intent.action === "create" && intent.type === "training") {
      const trainingResponse = await openai.responses.create({
        model: "gpt-5.2",
        input: `
Create a training program from this command:

${command}

Return JSON only:
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
        `,
      });

      const parsed = JSON.parse(cleanJson(trainingResponse.output_text));
      const programSlug = slugify(parsed.programTitle);

      const program = await prisma.trainingProgram.upsert({
        where: { slug: programSlug },
        update: {
          title: parsed.programTitle,
          description: parsed.description,
          goal: parsed.goal,
          level: parsed.level,
          duration: parsed.duration,
          isPublished: true,
        },
        create: {
          slug: programSlug,
          title: parsed.programTitle,
          description: parsed.description,
          goal: parsed.goal,
          level: parsed.level,
          duration: parsed.duration,
          isPublished: true,
        },
      });

      await prisma.exercise.deleteMany({
        where: { programId: program.id },
      });

      const exercises = await Promise.all(
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
              videoUrl: ex.videoUrl || "",
              order: ex.order ?? 0,
            },
          })
        )
      );

      return NextResponse.json({
        success: true,
        message: "Training program created",
        item: program,
        exercises,
      });
    }

    return NextResponse.json({ error: "Unsupported command" }, { status: 400 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "OpenAI command failed" },
      { status: 500 }
    );
  }
}