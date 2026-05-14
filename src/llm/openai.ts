import OpenAI from "openai";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";
import type { ChatInput, ChatResponse, LLMClient } from "./types.js";

interface OpenAIClientOptions {
  apiKey: string;
  baseUrl?: string;
  model: string;
}

export function createOpenAIClient(options: OpenAIClientOptions): LLMClient {
  return {
    async chat(input: ChatInput): Promise<ChatResponse> {
      if (!options.apiKey) {
        return {
          type: "message",
          content: "尚未配置 CHAUFFEUR_API_KEY（或 --api-key）。请复制 .env.example 为 .env，并填入你的 API Key。"
        };
      }

      const client = new OpenAI({
        apiKey: options.apiKey,
        baseURL: options.baseUrl
      });

      try {
        const completion = await client.chat.completions.create({
          model: options.model,
          messages: input.messages.map((message) => {
            if (message.role === "tool") {
              return {
                role: "user" as const,
                content: `工具 ${message.name} 返回：\n${message.content}`
              };
            }
            return message;
          }),
          tools: input.tools.map((tool) => ({
            type: "function" as const,
            function: {
              name: tool.name,
              description: tool.description,
              parameters: zodToLooseJsonSchema(tool.schema)
            }
          }))
        });

        const choice = completion.choices[0]?.message;
        const toolCall = choice?.tool_calls?.[0];

        if (toolCall?.type === "function") {
          return {
            type: "tool_call",
            toolName: toolCall.function.name,
            arguments: JSON.parse(toolCall.function.arguments || "{}")
          };
        }

        return {
          type: "message",
          content: choice?.content ?? ""
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          type: "message",
          content: `调用 LLM 接口失败：${message}`
        };
      }
    }
  };
}

function zodToLooseJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  const jsonSchema = zodToJsonSchema(schema, {
    target: "jsonSchema7",
    $refStrategy: "none"
  }) as Record<string, unknown>;

  if (
    jsonSchema.type === "object" &&
    (!("properties" in jsonSchema) || typeof jsonSchema.properties !== "object" || jsonSchema.properties === null)
  ) {
    return {
      ...jsonSchema,
      properties: {}
    };
  }

  return jsonSchema;
}
