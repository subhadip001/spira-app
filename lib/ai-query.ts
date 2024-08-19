import Groq from "groq-sdk";
import { models } from "./models";

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
    model: models.groq_models.LLAMA_3_8B,
    temperature: 0.3,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  return chatCompletion;
};
