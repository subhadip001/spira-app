import {
  createClaudeResponse,
  createGeminiResponse,
  createGroqChatCompletion,
} from "./ai-query";

const aiApiHandler = async (
  model: "claude" | "gemini" | "groq",
  prompt: {
    system_prompt: string;
    user_question: string;
  }
) => {
  switch (model) {
    case "claude":
      const response = await createClaudeResponse(
        prompt.system_prompt,
        prompt.user_question
      );
      return response;
    case "gemini":
      return await createGeminiResponse(
        prompt.system_prompt,
        prompt.user_question
      );
    case "groq":
      const stream = await createGroqChatCompletion(
        prompt.system_prompt,
        prompt.user_question
      );
      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
      }
      return fullResponse;
    default:
      return "Invalid model";
  }
};

export default aiApiHandler;
