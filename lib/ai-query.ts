import Groq from "groq-sdk"
import { models } from "./models"
import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI from "openai"

export const createGroqChatCompletionStreaming = async (
  system_prompt: string,
  user_question: string,
  model = models.groq_models.LLAMA_3_2_90B_VISION
) => {
  const API_KEY = process.env.GROQ_API_KEY
  const groq = new Groq({ apiKey: API_KEY })

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: system_prompt,
      },
      {
        role: "user",
        content: user_question,
      },
    ],
    model: model,
    temperature: 0.3,
    max_tokens: 2048,
    // top_p: 1,
    stream: true,
    stop: null,
  })

  return chatCompletion
}

export const createGroqChatCompletion = async (
  system_prompt: string,
  user_question: string,
  model = models.groq_models.LLAMA_3_3_70B_VERSATILE
) => {
  const API_KEY = process.env.GROQ_API_KEY
  const groq = new Groq({ apiKey: API_KEY })

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content: user_question,
        },
      ],
      model: model,
      temperature: 0.3,
      max_tokens: 2048,
      // top_p: 1,
      stream: false,
      stop: null,
    })
    return chatCompletion.choices[0].message.content
  } catch (error) {
    console.error("Error:", error)
    return ""
  }
}

export async function createAnthropicResponse(
  system_prompt: string,
  user_question: string
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const response = await anthropic.messages.create({
    messages: [{ role: "user", content: user_question }],
    model: models.anthropic_models.CLAUDE_3_5_SONNET,
    stream: false,
    max_tokens: 8192,
    system: system_prompt,
    temperature: 0.2,
  })

  return response.content[0].type === "text" ? response.content[0].text : ""
}

export async function createAnthropicResponseStreaming(
  system_prompt: string,
  user_question: string
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const response = await anthropic.messages.create({
    messages: [{ role: "user", content: user_question }],
    model: models.anthropic_models.CLAUDE_3_5_SONNET,
    stream: true,
    max_tokens: 8192,
    system: system_prompt,
    temperature: 0.2,
  })

  return response
}

export async function createOpenAIChatCompletion(
  system_prompt: string,
  user_question: string
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_question },
    ],
    model: models.openai_models.GPT_4,
    stream: false,
    max_tokens: 4000,
    temperature: 0.2,
  })
  return response.choices[0].message.content
}

export async function createOpenAIChatCompletionStreaming(
  system_prompt: string,
  user_question: string
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_question },
    ],
    model: models.openai_models.GPT_4,
    stream: true,
    max_tokens: 4000,
    temperature: 0.2,
  })
  return response
}
