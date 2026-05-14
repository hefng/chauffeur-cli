import prompts from "prompts";

export async function requestApproval(action: string): Promise<boolean> {
  const answer = await prompts({
    type: "confirm",
    name: "approved",
    message: `Agent 请求：${action}。是否允许？`,
    initial: false
  });

  return Boolean(answer.approved);
}
