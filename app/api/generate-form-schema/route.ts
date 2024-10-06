import aiApiHandler from "@/lib/ai-api-handler";
import { FORM_SCHEMA_GENERATOR_PROMPT } from "@/lib/utils";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (prompt === undefined || prompt === "") {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    });
  }

  try {
    const response = await aiApiHandler("groq", {
      system_prompt: FORM_SCHEMA_GENERATOR_PROMPT,
      user_question: prompt,
    });

    return Response.json({ message: response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
