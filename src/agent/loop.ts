import { buildSystemPrompt } from "./prompt.js";
import type { ProjectContext } from "./context.js";
import type { LLMClient, Message, Tool } from "../llm/types.js";
import { terminal } from "../ui/terminal.js";

interface RunAgentInput {
  task: string;
  cwd: string;
  llm: LLMClient;
  context: ProjectContext;
  tools: Tool[];
}

export async function runAgent(input: RunAgentInput): Promise<void> {
  terminal.info(`工作目录：${input.cwd}`);
  terminal.info(`任务：${input.task}`);

  const messages: Message[] = [
    { role: "system", content: buildSystemPrompt(input.context) },
    { role: "user", content: input.task }
  ];

  for (let step = 1; step <= 8; step += 1) {
    const response = await input.llm.chat({
      messages,
      tools: input.tools
    });

    if (response.type === "message") {
      terminal.write(response.content);
      return;
    }

    terminal.info(`调用工具：${response.toolName}`);
    const tool = input.tools.find((item) => item.name === response.toolName);

    if (!tool) {
      messages.push({
        role: "tool",
        name: response.toolName,
        content: `工具不存在：${response.toolName}`
      });
      continue;
    }

    const result = await tool.run(response.arguments);
    messages.push({
      role: "tool",
      name: response.toolName,
      content: result
    });
  }

  terminal.warn("已达到最大循环次数，建议收窄任务后重试。");
}
