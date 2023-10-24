import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

export async function POST (request: Request): Promise<Response> {
  const response = await request.json();
  return Response.json(response)
}
