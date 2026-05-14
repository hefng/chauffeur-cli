import { execa } from "execa";
import { z } from "zod";
import type { Tool } from "../llm/types.js";
import { requestApproval } from "../safety/approval.js";
import { classifyCommand } from "../safety/command-policy.js";

const schema = z.object({
  command: z.string(),
  args: z.array(z.string()).default([])
});

export function createRunCommandTool(options: { cwd: string }): Tool {
  return {
    name: "run_command",
    description: "在工作目录中执行命令。危险命令会被拦截，其他命令需要用户确认。",
    schema,
    async run(args: unknown): Promise<string> {
      const input = schema.parse(args);
      const policy = classifyCommand(input.command, input.args);

      if (policy === "blocked") {
        return `命令被安全策略拦截：${input.command} ${input.args.join(" ")}`;
      }

      const approved = await requestApproval(`执行命令：${input.command} ${input.args.join(" ")}`);
      if (!approved) return "用户拒绝执行命令。";

      try {
        const result = await execa(input.command, input.args, {
          cwd: options.cwd,
          timeout: 60_000,
          reject: false
        });
        return [
          `exitCode: ${result.exitCode}`,
          result.stdout ? `stdout:\n${result.stdout}` : "",
          result.stderr ? `stderr:\n${result.stderr}` : ""
        ].filter(Boolean).join("\n").slice(0, 30_000);
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    }
  };
}
