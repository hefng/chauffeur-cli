# chauffeur-cli

一个最小的 Codex CLI 风格 coding agent 骨架，项目名为 `chauffeur-cli`，适合从 Java + Vue 背景逐步学习 TypeScript CLI agent。

## 快速开始

```bash
npm install
copy .env.example .env
npm run dev -- "帮我看看这个项目结构"
```

环境变量统一使用 `CHAUFFEUR_*`：

```bash
CHAUFFEUR_API_KEY=your_api_key_here
CHAUFFEUR_BASE_URL=
CHAUFFEUR_MODEL=gpt-4.1-mini
```

说明：
- `CHAUFFEUR_API_KEY` 必填
- `CHAUFFEUR_BASE_URL` 选填，不填则走 SDK 默认端点
- `CHAUFFEUR_MODEL` 选填
- 不再支持 `OPENAI_*` 变量名

也可以指定工作目录：

```bash
npm run dev -- --cwd C:\path\to\your\project "帮我修复测试"
```

也可以通过 CLI 参数覆盖 `.env`（优先级更高）：

```bash
npm run dev -- --api-key sk-xxx --model gpt-4.1-mini "帮我分析当前项目"
```

DeepSeek（OpenAI 兼容）示例：

```bash
npm run dev -- --base-url https://api.deepseek.com --model deepseek-chat "帮我重构这段代码"
```

中转站示例：

```bash
npm run dev -- --base-url https://your-proxy.example.com/v1 --model your-model-name "帮我写测试"
```

构建后也可以直接使用命令名：

```bash
chauffeur "帮我分析当前项目"
```

## 目录说明

```txt
src/cli.ts             CLI 入口，解析参数并启动 agent
src/agent/loop.ts      Agent 主循环
src/agent/prompt.ts    系统提示词和行为规则
src/agent/context.ts   收集当前项目上下文
src/llm/types.ts       LLM 和工具的抽象类型
src/llm/openai.ts      OpenAI 客户端实现
src/tools/*            Agent 可调用的工具
src/safety/*           命令策略和用户审批
src/ui/terminal.ts     终端输出和交互
```
