# chauffeur-cli

`chauffeur-cli` 是一个轻量的 CLI coding agent，安装后可以直接通过 `chauffeur` 命令使用。

## 安装

```bash
npm i -g chauffeur-cli
```

或者在项目内直接使用：

```bash
npx chauffeur-cli "帮我分析这个项目"
```

## 使用

首次使用时需要配置环境变量：

```bash
CHAUFFEUR_API_KEY=your_api_key_here
CHAUFFEUR_BASE_URL=
CHAUFFEUR_MODEL=gpt-4.1-mini
```

说明：

- `CHAUFFEUR_API_KEY` 必填
- `CHAUFFEUR_BASE_URL` 必填
- `CHAUFFEUR_MODEL` 必填

如果你习惯用 `.env`，也可以复制示例文件：

```bash
copy .env.example .env
```

然后运行：

```bash
chauffeur "帮我看看这个项目结构"
```

也可以指定工作目录：

```bash
chauffeur --cwd C:\path\to\your\project "帮我修复测试"
```

或者显式覆盖模型和接口地址：

```bash
chauffeur --api-key sk-xxx --model gpt-4.1-mini "帮我分析当前项目"
chauffeur --base-url https://api.deepseek.com --model deepseek-chat "帮我重构这段代码"
```

## 开发

```bash
npm install
npm run dev -- "帮我看看这个项目结构"
```

## 发布内容

这个包只发布必要文件：

- `dist/`
- `README.md`

## 许可

MIT
