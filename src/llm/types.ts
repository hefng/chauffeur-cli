import type { z } from "zod";

export type Message =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "tool"; name: string; content: string };

export interface Tool {
  name: string;
  description: string;
  schema: z.ZodTypeAny;
  run(args: unknown): Promise<string>;
}

export interface ChatInput {
  messages: Message[];
  tools: Tool[];
}

export type ChatResponse =
  | { type: "message"; content: string }
  | { type: "tool_call"; toolName: string; arguments: unknown };

export interface LLMClient {
  chat(input: ChatInput): Promise<ChatResponse>;
}
