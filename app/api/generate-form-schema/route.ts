import aiApiHandler from "@/lib/ai-api-handler"
import { FORM_SCHEMA_GENERATOR_PROMPT } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  if (prompt === undefined || prompt === "") {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    })
  }

  try {
    const stream = await aiApiHandler("groq", {
      system_prompt: FORM_SCHEMA_GENERATOR_PROMPT,
      user_question: prompt,
    })

    if (!stream) {
      return new Response(
        JSON.stringify({ message: "Error processing request" }),
        {
          status: 500,
        }
      )
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          console.log(chunk, "chunk")
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const content = chunk.delta.text || ""
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          }
        }
        controller.close()
      },
    })

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "application/json",
        "Transfer-Encoding": "chunked",
      },
    })

    // return Response.json({ message: response }, { status: 200 });
  } catch (error) {
    console.error(error)
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    )
  }
}
