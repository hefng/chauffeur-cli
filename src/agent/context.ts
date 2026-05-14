import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";

export interface ProjectContext {
  cwd: string;
  gitStatus: string;
  projectHints: string[];
}

export async function collectContext(cwd: string): Promise<ProjectContext> {
  const projectHints: string[] = [];

  if (await exists(join(cwd, "package.json"))) {
    projectHints.push("Node.js/TypeScript");
    const packageJson = await readFile(join(cwd, "package.json"), "utf8");
    if (packageJson.includes("next")) projectHints.push("Next.js");
    if (packageJson.includes("vue")) projectHints.push("Vue");
  }

  if (await exists(join(cwd, "pom.xml"))) projectHints.push("Java/Maven");
  if (await exists(join(cwd, "build.gradle"))) projectHints.push("Java/Gradle");

  let gitStatus = "";
  try {
    const result = await execa("git", ["status", "--short"], { cwd });
    gitStatus = result.stdout.trim();
  } catch {
    gitStatus = "";
  }

  return { cwd, gitStatus, projectHints };
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
