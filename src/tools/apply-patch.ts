import { execa } from "execa";
import { z } from "zod";
import type { Tool } from "../llm/types.js";
import { requestApproval } from "../safety/approval.js";

const schema = z.object({
  patch: z.string()
});

export function createApplyPatchTool(options: { cwd: string }): Tool {
  return {
    name: "apply_patch",
    description: "使用 git apply 应用 unified diff patch。",
    schema,
    async run(args: unknown): Promise<string> {
      const input = schema.parse(args);
      const approved = await requestApproval("应用 patch 修改文件");
      if (!approved) return "用户拒绝应用 patch。";

      const result = await execa("git", ["apply", "--"], {
        cwd: options.cwd,
        input: input.patch,
        reject: false
      });

      return result.exitCode === 0
        ? "patch 已应用。"
        : `patch 应用失败：\n${result.stderr || result.stdout}`;
    }
  };
}
