import { createGeminiResponse, createGroqChatCompletion } from "@/lib/ai-query";
import { FORM_SCHEMA_GENERATOR_PROMPT } from "@/lib/utils";

export default async function genarateForSchema(prompt: string) {
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

    return { success: true, data: fullResponse };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error processing request" };
  }
}
