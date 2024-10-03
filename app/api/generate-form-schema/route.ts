import {
  createClaudeResponse,
  createGeminiResponse,
  createGroqChatCompletion,
} from "@/lib/ai-query";
import { FORM_SCHEMA_GENERATOR_PROMPT } from "@/lib/utils";
import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (prompt === undefined || prompt === "") {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    });
  }

  try {
    // const stream = await createGroqChatCompletion(
    //   FORM_SCHEMA_GENERATOR_PROMPT,
    //   prompt
    // );

    const response = await createClaudeResponse(
      FORM_SCHEMA_GENERATOR_PROMPT,
      prompt
    );

    return Response.json({ message: response }, { status: 200 });

    // const readableStream = new ReadableStream({
    //   async start(controller) {
    //     for await (const chunk of stream) {
    //       const content = chunk?.choices?.[0]?.delta?.content || "";
    //       if (content) {
    //         controller.enqueue(new TextEncoder().encode(content));
    //       }
    //     }
    //     controller.close();
    //   },
    // });

    // return new NextResponse(readableStream, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Transfer-Encoding": "chunked",
    //   },
    // });

    // let fullResponse = "";
    // for await (const chunk of stream) {
    //   const content = chunk.choices[0]?.delta?.content || "";
    //   fullResponse += content;
    // }

    // return Response.json({ message: fullResponse }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
