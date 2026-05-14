import { resolve } from "node:path";

export function resolveInsideWorkspace(cwd: string, requestedPath: string): string {
  const root = resolve(cwd);
  const target = resolve(root, requestedPath);

  if (target !== root && !target.startsWith(root + "\\")) {
    throw new Error(`路径不在工作目录内：${requestedPath}`);
  }

  return target;
}
