import { aiApiHandlerStreaming, aiApiHandler } from "@/lib/ai-api-handler"
import {
  FORM_SCHEMA_EDITOR_SYSTEM_PROMPT,
  FORM_SCHEMA_EDITOR_USER_PROMPT,
} from "@/lib/prompts/form-edit-prompts"
import { FORM_SCHEMA_GENERATOR_PROMPT } from "@/lib/prompts/form-gen-prompts"
import { NextResponse } from "next/server"
import { ChatCompletionChunk as OpenAIChatCompletionChunk } from "openai/resources/index.mjs"

export async function POST(req: Request) {
  const {
    prompt,
    formSchema,
    streaming = true,
  }: {
    prompt: string
    formSchema: string
    streaming?: boolean
  } = await req.json()

  if (prompt === undefined || prompt === "") {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    })
  }

  const userInstruction = FORM_SCHEMA_EDITOR_USER_PROMPT.replaceAll(
    "{{form_schema}}",
    formSchema
  ).replaceAll("{{instruction}}", prompt)

  try {
    if (streaming) {
      const stream = await aiApiHandlerStreaming("groq", {
        system_prompt: FORM_SCHEMA_EDITOR_SYSTEM_PROMPT,
        user_question: userInstruction,
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

    const response = await aiApiHandler("groq", {
      system_prompt: FORM_SCHEMA_GENERATOR_PROMPT,
      user_question: userInstruction,
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
