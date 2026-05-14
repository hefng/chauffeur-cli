import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { Tool } from "../llm/types.js";
import { resolveInsideWorkspace } from "./path.js";

const schema = z.object({
  path: z.string()
});

export function createReadFileTool(options: { cwd: string }): Tool {
  return {
    name: "read_file",
    description: "读取工作目录内的文本文件。",
    schema,
    async run(args: unknown): Promise<string> {
      const input = schema.parse(args);
      const filePath = resolveInsideWorkspace(options.cwd, input.path);
      const content = await readFile(filePath, "utf8");
      return content.slice(0, 20_000);
    }
  };
}
