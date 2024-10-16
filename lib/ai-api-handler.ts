import {
  createAnthropicResponse,
  createAnthropicResponseStreaming,
  createGroqChatCompletion,
  createOpenAIChatCompletion,
  createOpenAIChatCompletionStreaming,
} from "./ai-query"

const aiApiHandler = async (
  model: "anthropic" | "gemini" | "groq" | "openai",
  prompt: {
    system_prompt: string
    user_question: string
  }
) => {
  switch (model) {
    case "anthropic":
      const response = await createAnthropicResponse(
        prompt.system_prompt,
        prompt.user_question
      )
      return response
    case "groq":
      const stream = await createGroqChatCompletion(
        prompt.system_prompt,
        prompt.user_question
      )
      let fullResponse = ""
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ""
        fullResponse += content
      }
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
      const stream = await createGroqChatCompletion(
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
