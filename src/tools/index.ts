import type { Tool } from "../llm/types.js";
import { createApplyPatchTool } from "./apply-patch.js";
import { createGitDiffTool } from "./git-diff.js";
import { createReadFileTool } from "./read-file.js";
import { createRunCommandTool } from "./run-command.js";
import { createSearchTool } from "./search.js";
import { createWriteFileTool } from "./write-file.js";

interface CreateToolsOptions {
  cwd: string;
}

export function createTools(options: CreateToolsOptions): Tool[] {
  return [
    createReadFileTool(options),
    createSearchTool(options),
    createGitDiffTool(options),
    createApplyPatchTool(options),
    createWriteFileTool(options),
    createRunCommandTool(options)
  ];
}
