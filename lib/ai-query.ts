import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { models } from "./models";
import { Anthropic } from "@anthropic-ai/sdk";
import OpenaAi from "openai";

export const createGroqChatCompletion = async (
  system_prompt: string,
  user_question: string
) => {
  const API_KEY = process.env.GROQ_API_KEY;
  console.log(user_question);
  const groq = new Groq({ apiKey: API_KEY });
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
    model: models.groq_models.LLAMA_3_1_70B,
    temperature: 0.8,
    max_tokens: 2048,
    // top_p: 1,
    stream: true,
    stop: null,
  });

  return chatCompletion;
};

export async function createGeminiResponse(
  system_prompt: string,
  user_question: string
) {
  const gemini_api_key = process.env.GEMINI_API_KEY as string;
  const googleAI = new GoogleGenerativeAI(gemini_api_key);

  const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
  };

  const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: system_prompt,
    generationConfig: geminiConfig,
  });

  const result = await geminiModel.generateContent(user_question);
  const response = await result.response;
  const text = response.text();
  return text;
}

export async function createAnthropicResponse(
  system_prompt: string,
  user_question: string
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await anthropic.messages.create({
    messages: [{ role: "user", content: user_question }],
    model: models.anthropic_models.CLAUDE_3_5_SONNET,
    stream: false,
    max_tokens: 8192,
    system: system_prompt,
    temperature: 0.2,
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function createOpenAIChatCompletion(
  system_prompt: string,
  user_question: string
) {
  const openai = new OpenaAi({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_question },
    ],
    model: models.openai_models.GPT_4,
    stream: false,
    max_tokens: 4000,
    temperature: 0.2,
  });
  return response.choices[0].message.content;
}
