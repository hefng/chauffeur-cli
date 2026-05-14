import { execa } from "execa";
import { z } from "zod";
import type { Tool } from "../llm/types.js";

const schema = z.object({});

export function createGitDiffTool(options: { cwd: string }): Tool {
  return {
    name: "git_diff",
    description: "查看当前 Git 工作区修改。",
    schema,
    async run(): Promise<string> {
      try {
        const [status, diff] = await Promise.all([
          execa("git", ["status", "--short"], { cwd: options.cwd }),
          execa("git", ["diff"], { cwd: options.cwd })
        ]);
        return [`status:\n${status.stdout}`, `diff:\n${diff.stdout}`].join("\n\n").slice(0, 30_000);
      } catch {
        return "当前目录不是 Git 仓库，或无法读取 git diff。";
      }
    }
  };
}
