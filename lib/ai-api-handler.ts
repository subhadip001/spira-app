import {
  createAnthropicResponse,
  createGeminiResponse,
  createGroqChatCompletion,
  createOpenAIChatCompletion,
} from "./ai-query";

const aiApiHandler = async (
  model: "anthropic" | "gemini" | "groq" | "openai",
  prompt: {
    system_prompt: string;
    user_question: string;
  }
) => {
  switch (model) {
    case "anthropic":
      const response = await createAnthropicResponse(
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
    case "openai":
      const openaiResponse = await createOpenAIChatCompletion(
        prompt.system_prompt,
        prompt.user_question
      );
      return openaiResponse;
    default:
      return "Invalid model";
  }
};

export default aiApiHandler;
