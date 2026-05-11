import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
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

    // STEP 1 — Generate recipe JSON
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

Style:
- premium fitness food
- MacroLab aesthetic
- healthy performance meals
- clean modern plating
      `,
    });

    const recipe = JSON.parse(recipeResponse.output_text);

    // STEP 2 — Generate clean food image WITHOUT TEXT
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `
Create a premium MacroLab fitness food photograph.

Recipe:
${recipe.title}

Description:
${recipe.description}

Visual style:
- ultra realistic food photography
- cinematic lighting
- dark moody black background
- premium fitness meal prep aesthetic
- luxurious healthy food presentation
- modern commercial food photography
- shallow depth of field
- subtle lime green accents in props/background only
- high contrast
- premium restaurant quality plating

IMPORTANT:
- NO text
- NO words
- NO typography
- NO labels
- NO logos
- NO watermarks
- image only
- clean hero image only
- suitable for website recipe cards

Extra visual direction:
${recipe.imagePrompt}
      `,
      size: "1536x1024",
    });

    const base64Image = imageResponse.data?.[0]?.b64_json;

    if (!base64Image) {
      throw new Error("Image generation failed");
    }

    // STEP 3 — Upload to Cloudinary
    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      {
        folder: "macrolab/recipes",
        public_id: slugify(recipe.title),
        overwrite: true,
      }
    );

    // STEP 4 — Save to database
    const savedRecipe = await prisma.recipe.upsert({
      where: {
        slug: slugify(recipe.title),
      },
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
      recipe: savedRecipe,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}