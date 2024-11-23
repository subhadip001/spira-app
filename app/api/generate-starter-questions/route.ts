import { aiApiHandler, aiApiHandlerStreaming } from "@/lib/ai-api-handler"
import { models } from "@/lib/models"
import { RESPONSE_CHAT_SYSTEM_PROMPT } from "@/lib/prompts/csv-prompts"
import {
  STARTER_QUESTIONS_GEN_SYSTEM_PROMPT,
  STARTER_QUESTIONS_GEN_USER_PROMPT,
} from "@/lib/prompts/tool-prompts"
import { NextResponse } from "next/server"
import { ChatCompletionChunk as OpenAIChatCompletionChunk } from "openai/resources/index.mjs"

export async function POST(req: Request) {
  const { csvXml, streaming = false }: { csvXml: string; streaming?: boolean } =
    await req.json()

  const userPrompt = STARTER_QUESTIONS_GEN_USER_PROMPT.replace(
    "{{CSV_XML}}",
    csvXml
  )

  try {
    if (streaming) {
      const stream = await aiApiHandlerStreaming("openai", {
        system_prompt: STARTER_QUESTIONS_GEN_SYSTEM_PROMPT,
        user_question: userPrompt,
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
            if ((chunk as OpenAIChatCompletionChunk).choices[0].delta.content) {
              const content =
                (chunk as OpenAIChatCompletionChunk).choices[0].delta.content ||
                ""
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
    }

    const response = await aiApiHandler("openai", {
      system_prompt: STARTER_QUESTIONS_GEN_SYSTEM_PROMPT,
      user_question: userPrompt,
    })

    return Response.json({ message: response }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    )
  }
}
