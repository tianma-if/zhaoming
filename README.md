# 照命

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-%3E%3D1.3-orange?logo=bun)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-AGPL_3.0-blue.svg)](LICENSE)

`照命` 是一个**纯开源、无广告**的现代化 AI 传统命理排盘与分析系统。

我们致力于打破传统算命网站充斥广告、页面嘈杂且带有迷信色彩的现状，用**克制的视觉语言、理性的数据推演与现代大模型（LLM）**，提供一个干净、现代的数字命理工作台。

### 🌟 它能为你带来什么？

* **如果你是命理爱好者 / 普通用户**：
  * **干净纯粹的排盘体验**：支持八字（大运、十神、神煞）及紫微斗数（4x4 环形星盘）的专业排盘，无任何弹窗广告。
  * **智能 AI 解盘**：通过流式对话与个性化判词，用理性的视角帮你剖析命盘与命运选择。
* **如果你是独立开发者 / 学习者**：
  * **开箱即用的全栈模板**：完整跑通了 Next.js + Better Auth + Neon Postgres + Vercel AI SDK 的全套基础设施，可直接作为你的项目起手式。
  * **极致的 Token 成本优化**：采用「算法排盘（零成本、确定性高） + 按需 AI 解读（按需调用）」的双轨架构，完美规避了大模型 API 账单爆炸的风险，适合自部署或进行二次开发。

## 在线地址

- 生产域名：[https://www.zhaoming.app](https://www.zhaoming.app)
- 部署平台：`Vercel`


## 技术栈

- `Next.js 16.2.6` + `App Router`
- `React 19.2.4`
- `TypeScript 5`
- `Tailwind CSS 4`
- `shadcn/ui`（`new-york` 风格）
- `Radix UI`
- `React Hook Form` + `Zod`
- `Better Auth`
- `Neon Postgres`
- `Vercel AI SDK 6`
- `OpenAI-compatible Provider`（当前默认用于接 `OpenRouter`）
- `lunar-typescript`
- `iztro`

## 本地开发

### 包管理器

项目统一使用 `Bun`：

- 锁文件为 `bun.lock`
- 安装、开发、构建、Lint 均使用 `bun`
- 默认不再使用 `npm`

如果本机还没安装 Bun，请先参考 [Bun 官方安装说明](https://bun.sh/docs/installation) 完成安装。

```bash
curl -fsSL https://bun.sh/install | bash
```

### 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

需要填写的关键变量：

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5555
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

AI_PROVIDER=openai-compatible
AI_MODEL=~google/gemini-flash-latest
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=

AUTOMATION_API_KEY=
```

说明：

- `DATABASE_URL`：`Neon Postgres` 连接串
- `BETTER_AUTH_SECRET`：至少 32 位高强度随机字符串（本地开发可运行 `openssl rand -hex 32` 生成）
- `BETTER_AUTH_URL`：当前应用地址，本地默认 `http://localhost:5555`
- `GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET`：Google OAuth 凭据
- `AI_PROVIDER`：
  - `gateway` 表示走 AI Gateway 风格的模型名
  - `openai-compatible` 表示走 OpenRouter 或其他 OpenAI 兼容接口
- `AI_BASE_URL`：如果使用 `openai-compatible`，OpenRouter 可填写 `https://openrouter.ai/api/v1`
- `AUTOMATION_API_KEY`：保护 `/api/automation/publish-blog`

### 安装与启动

安装依赖：

```bash
bun install
```

### 数据库初始化与迁移

项目使用原始 `pg` 驱动执行 SQL 交互，表结构中业务表（`public.users`）外键关联了 `neon_auth.user`。因此，数据库的初始化和迁移需要遵循以下顺序：

1. **初始化 Better Auth 认证表**：
   - **Neon 托管用户**：直接在 Neon 后台开启 `Neon Auth` 即可，其会自动托管在 `neon_auth` 架构下。
   - **普通/本地 PostgreSQL**：可以通过 `better-auth` 命令行生成并迁移认证表：
     ```bash
     bunx better-auth migrate
     ```
2. **执行业务迁移 SQL**：
   在数据库中，按照文件名编号顺序依次执行 [db/migrations/](./db/migrations/) 目录下的全部 SQL 文件以初始化业务表（如 `users`、`divinations`、`posts` 等）：
   - `0001_init.sql`
   - `0002_add_chenggu_divination_type.sql`
   - `0002_stripe_checkout_sessions.sql`
   - `0003_add_sanshi_divination_type.sql`
   - `0003_billing_provider_refactor.sql`

启动开发服务器：

```bash
bun run dev
```

打开：

- [http://localhost:5555](http://localhost:5555)

常用检查命令：

```bash
bun run lint
bun run build
```

补充说明：

- 本地默认地址为 `http://localhost:5555`
- 鉴权相关环境变量如果误拉成生产域名，开发环境会优先回退到本地地址，避免 Google OAuth 出现 `Invalid origin`

## 目录结构

```text
src/
  app/
    (marketing)/
    (auth)/
    (dashboard)/
    api/
  components/
    divination/
      bazi-basic-info-card.tsx    # 八字基本信息卡片与复制入口
      bazi-chart.tsx              # 八字排盘基础信息与四柱详解
      bazi-dayun-analysis.tsx     # 八字大运详情与十年运势卡片
      bazi-insights.tsx           # 八字分析区组合：五行、十神、神煞、大运
      bazi-pillars-info-card.tsx  # 八字四柱详解卡片与复制入口
      bazi-shensha-analysis.tsx   # 八字神煞分析四柱分栏
      bazi-ten-god-analysis.tsx   # 八字十神分析四柱分栏
      bazi-verdict-card.tsx       # 八字 AI 判词卡片与流式生成入口
      birth-place-input.tsx       # 出生地搜索输入
      chart-shell.tsx             # 简单命盘图表外壳
      copy-content-button.tsx     # 客户端复制按钮
      divination-form.tsx         # 新建测算表单
      wuxing-analysis-card.tsx    # 可复用五行分析卡片
      wuxing-badge.tsx            # 五行彩色徽章
      wuxing-radar-chart.tsx      # SVG 五行雷达图
      ziwei-chart.tsx             # 紫微斗数 4 x 4 宫位网格
    layout/
    prose/
    ui/
  lib/
    ai/
    auth/
    divination/
    blog/
    db.ts
    auth.ts
    auth-client.ts
  types/
db/
  migrations/
```

## 数据库与鉴权

认证相关表由 `Better Auth / Neon Auth` 使用：

- `neon_auth.user`
- `neon_auth.session`
- `neon_auth.account`
- `neon_auth.verification`

业务表位于 `public`：

- `public.users`
- `public.divinations`
- `public.posts`

初始化 SQL 迁移文件存放于 [db/migrations/](./db/migrations/) 目录。首个初始化脚本为：

- [db/migrations/0001_init.sql](./db/migrations/0001_init.sql)

当前代码使用的是：

- 应用内 `Better Auth`
- 数据库存储在 `Neon Postgres`
- `search_path` 已对齐为 `neon_auth,public`

也就是说：

- Better Auth 的认证表优先走 `neon_auth`
- 业务表继续放在 `public`
- 业务代码通过 `public.users.id -> neon_auth.user.id` 关联

Google OAuth 回调路径为：

```text
/api/auth/callback/google
```

本地 Google Console 需要把这个 URI 加到白名单：

```text
http://localhost:5555/api/auth/callback/google
```

## AI Provider

项目支持两种模式：

1. `AI_PROVIDER=gateway`
2. `AI_PROVIDER=openai-compatible`

目前推荐接法是 `OpenRouter + OpenAI-compatible`：

```env
AI_PROVIDER=openai-compatible
AI_MODEL=~google/gemini-flash-latest
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=your_openrouter_key
```

对应实现入口：

- [src/lib/ai/provider.ts](./src/lib/ai/provider.ts)
- 预设 Prompt 模板位于 [src/lib/ai/divination-prompts](./src/lib/ai/divination-prompts)
- Prompt 输入组装位于 [src/lib/ai/divination-prompt-input.ts](./src/lib/ai/divination-prompt-input.ts)

如果没有配置 AI 相关环境变量，`/api/ai/divination` 会返回占位文本，而不是直接报错。

## 未来路线 (Roadmap)

- 🔄 **数据库管理重构**：引入 Drizzle/Prisma 等 ORM 统一管理 Better Auth 与业务表的 Schema 迁移，逐步淘汰纯手写 SQL。
- 🧪 **算法补强与扩充**：在现有的三式、六爻、梅花、称骨基础上，继续丰富盘面细节展示逻辑。
- 🤖 **解读模板升级**：优化 AI 解读 Prompt，支持定制不同流派分析判词。
- 📝 **SEO 自动化博客**：进一步优化基于 Markdown 与白名单盘面组件嵌入的博客自动化发布机制，加速收录与流量沉淀。

## 开源贡献

欢迎提交 Issue 报告 Bug 或提出 Feature 建议。如果你想提交 Pull Request (PR) 贡献代码：

1. **Fork** 本仓库到你的个人 GitHub 账号。
2. 基于你 Fork 的仓库创建你的特性分支（例如 `feature/amazing-feature`）。
3. 提交修改并推送至你的分支，然后发起一个针对本仓库 `main` 分支的 Pull Request。

*注意：对于具有主仓库写入权限的协同开发者，为了保证主线分支干净，请遵循项目分支约束，直接在 `main` 分支上完成修改提交。*

## 鸣谢与致敬

本项目在设计灵感与工程实现上参考或使用了以下优秀项目，在此致以诚挚的感谢：

- **[FateMaster.AI](https://www.fatemaster.ai/)**：启发了本项目的产品定位与现代化交互设计理念。
- **[next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter)**：本项目后台工作台布局及骨架结构基于此进行定制与二次开发。

## 开源协议

本项目基于 **GNU Affero General Public License v3.0 (AGPL-3.0)** 协议开源。详情请参阅 [LICENSE](./LICENSE) 文件。
