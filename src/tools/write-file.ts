import { writeFile } from "node:fs/promises";
import { z } from "zod";
import type { Tool } from "../llm/types.js";
import { requestApproval } from "../safety/approval.js";
import { resolveInsideWorkspace } from "./path.js";

const schema = z.object({
  path: z.string(),
  content: z.string()
});

export function createWriteFileTool(options: { cwd: string }): Tool {
  return {
    name: "write_file",
    description: "写入工作目录内的文件。适合创建新文件或小范围覆盖。",
    schema,
    async run(args: unknown): Promise<string> {
      const input = schema.parse(args);
      const approved = await requestApproval(`写入文件：${input.path}`);
      if (!approved) return "用户拒绝写入。";

      const filePath = resolveInsideWorkspace(options.cwd, input.path);
      await writeFile(filePath, input.content, "utf8");
      return `已写入：${input.path}`;
    }
  };
}
