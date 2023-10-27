import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";

export async function POST (request: Request): Promise<Response> {
  const data = await request.json();
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const systemTemplate =
    "You are a helpful assistant that translates English into {output_language}.";

  const humanTemplate = "Can you translate '{input_text}' into {output_language} for me? Only output the translated text.";

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", humanTemplate],
  ]);

  const formatChatPrompt = await chatPrompt.formatMessages({
    output_language: 'German',
    input_text: data.message
  })

  const llmResult = await chatModel.predictMessages(formatChatPrompt);

  return Response.json({message: llmResult.content})
}
