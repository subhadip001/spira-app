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
    const chatCompletion = await createGroqChatCompletion(
      FORM_SCHEMA_GENERATOR_PROMPT,
      prompt
    );

    let fullResponse = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
    }

    // const fullResponse = await createGeminiResponse(
    //   FORM_SCHEMA_GENERATOR_PROMPT,
    //   prompt
    // );

    console.log(fullResponse);

    return Response.json({ message: fullResponse }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
