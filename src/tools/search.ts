import { execa } from "execa";
import { z } from "zod";
import type { Tool } from "../llm/types.js";

const schema = z.object({
  query: z.string(),
  glob: z.string().optional()
});

export function createSearchTool(options: { cwd: string }): Tool {
  return {
    name: "search",
    description: "使用 ripgrep 在工作目录中搜索代码。",
    schema,
    async run(args: unknown): Promise<string> {
      const input = schema.parse(args);
      const rgArgs = ["--line-number", "--hidden", "--glob", "!node_modules", input.query];
      if (input.glob) rgArgs.splice(3, 0, "--glob", input.glob);

      try {
        const result = await execa("rg", rgArgs, { cwd: options.cwd });
        return result.stdout.slice(0, 20_000) || "没有搜索结果。";
      } catch (error) {
        const output = error instanceof Error ? error.message : String(error);
        return output.includes("exit code 1") ? "没有搜索结果。" : output;
      }
    }
  };
}
