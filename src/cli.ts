#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import prompts from "prompts";
import { runAgent } from "./agent/loop.js";
import { collectContext } from "./agent/context.js";
import { createOpenAIClient } from "./llm/openai.js";
import { createTools } from "./tools/index.js";
import { terminal } from "./ui/terminal.js";

const program = new Command();

program
  .name("chauffeur")
  .description("A minimal Codex-style terminal coding agent.")
  .argument("[task]", "Task for the coding agent")
  .option("--cwd <path>", "Workspace directory", process.cwd())
  .option("--model <model>", "Model name", process.env.CHAUFFEUR_MODEL ?? "gpt-4.1-mini")
  .option("--api-key <key>", "API key", process.env.CHAUFFEUR_API_KEY ?? "")
  .option("--base-url <url>", "LLM API base URL", process.env.CHAUFFEUR_BASE_URL ?? "")
  .parse(process.argv);

const options = program.opts<{ cwd: string; model: string; apiKey: string; baseUrl: string }>();
let task = program.args.join(" ").trim();

if (!task) {
  const answer = await prompts({
    type: "text",
    name: "task",
    message: "你想让 coding agent 做什么？"
  });
  task = String(answer.task ?? "").trim();
}

if (!task) {
  terminal.error("没有收到任务，已退出。");
  process.exit(1);
}

const cwd = options.cwd;
const llm = createOpenAIClient({
  model: options.model,
  apiKey: options.apiKey,
  baseUrl: options.baseUrl || undefined
});
const context = await collectContext(cwd);
const tools = createTools({ cwd });

await runAgent({
  task,
  cwd,
  llm,
  context,
  tools
});
