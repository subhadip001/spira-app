import {
  createAnthropicResponse,
  createAnthropicResponseStreaming,
  createGroqChatCompletion,
  createGroqChatCompletionStreaming,
  createOpenAIChatCompletion,
  createOpenAIChatCompletionStreaming,
} from "./ai-query"

const aiApiHandler = async (
  providor: "anthropic" | "gemini" | "groq" | "openai",
  prompt: {
    system_prompt: string
    user_question: string
  },
  model?: string
) => {
  switch (providor) {
    case "anthropic":
      const response = await createAnthropicResponse(
        prompt.system_prompt,
        prompt.user_question
      )
      return response
    case "groq":
      const fullResponse = await createGroqChatCompletion(
        prompt.system_prompt,
        prompt.user_question,
        model
      )
      return fullResponse
    case "openai":
      const openaiResponse = await createOpenAIChatCompletion(
        prompt.system_prompt,
        prompt.user_question
      )
      return openaiResponse
    default:
      return "Invalid model"
  }
}

const aiApiHandlerStreaming = async (
  model: "anthropic" | "groq" | "openai",
  prompt: {
    system_prompt: string
    user_question: string
  }
) => {
  switch (model) {
    case "anthropic":
      const response = await createAnthropicResponseStreaming(
        prompt.system_prompt,
        prompt.user_question
      )
      return response
    case "groq":
      const stream = await createGroqChatCompletionStreaming(
        prompt.system_prompt,
        prompt.user_question
      )
      return stream
    case "openai":
      const openaiResponse = await createOpenAIChatCompletionStreaming(
        prompt.system_prompt,
        prompt.user_question
      )
      return openaiResponse
    default:
      return "Invalid model"
  }
}

export { aiApiHandler, aiApiHandlerStreaming }
