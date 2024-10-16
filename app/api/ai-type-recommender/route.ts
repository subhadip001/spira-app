import { aiApiHandler } from "@/lib/ai-api-handler"
import { AI_POWERED_FORM_TYPE_RECOMMENDER_PROMPT } from "@/lib/prompts/form-gen-prompts"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  if (prompt === undefined || prompt === "") {
    console.log("Invalid request")
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    })
  }

  try {
    const response = await aiApiHandler("groq", {
      system_prompt: AI_POWERED_FORM_TYPE_RECOMMENDER_PROMPT,
      user_question: prompt,
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
