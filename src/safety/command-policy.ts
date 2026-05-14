export type CommandPolicy = "allowed" | "blocked";

const blockedPatterns = [
  /rm\s+-rf/i,
  /git\s+reset\s+--hard/i,
  /del\s+\/s/i,
  /format\b/i,
  /curl\b.*\|\s*(sh|bash)/i,
  /sudo\b/i,
  /chmod\s+-R\s+777/i
];

export function classifyCommand(command: string, args: string[]): CommandPolicy {
  const fullCommand = [command, ...args].join(" ");
  return blockedPatterns.some((pattern) => pattern.test(fullCommand)) ? "blocked" : "allowed";
}
