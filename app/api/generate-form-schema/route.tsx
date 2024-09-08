import genarateForSchema from "@/app/_functions/genarateFormSchema";
import { createGeminiResponse, createGroqChatCompletion } from "@/lib/ai-query";
import { FORM_SCHEMA_GENERATOR_PROMPT } from "@/lib/utils";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (prompt === undefined || prompt === "") {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    });
  }
  try {
    const returndevalued = await genarateForSchema(prompt);

    if (!returndevalued.success) {
      throw new Error(returndevalued.message);
    }
    return Response.json({ message: returndevalued.data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
