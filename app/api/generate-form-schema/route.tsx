import { createGroqChatCompletion } from "@/lib/ai-query";
import { system_prompt } from "@/lib/utils";

export async function POST(req: Request) {
  const { question } = await req.json();

  if (question === undefined || question === "") {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    });
  }

  try {
    const chatCompletion = await createGroqChatCompletion(
      system_prompt,
      question
    );

    let fullResponse = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
    }

    return Response.json({ message: fullResponse }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
