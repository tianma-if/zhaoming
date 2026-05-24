# 知微

`知微` 是一个基于 `Next.js App Router` 构建的 AI 传统命理 SaaS 原型，当前聚焦于“现代化命理工作台”这一产品方向。

它的目标不是复刻传统算命站，而是用更克制的视觉语言、更清晰的交互结构和 AI 辅助解读能力，把八字、紫微斗数等传统命理能力整理成可持续扩展的数字产品。

产品策略上，系统先用程序完成八字排盘、紫微斗数等基础测算，优先输出低成本、稳定可复用的结果；AI 仅在用户主动点击后提供更深入的个性化解读。整体遵循“规则计算做获客，AI 解读做转化，报告/追问做复购”的产品路径。

## 在线地址

- 生产域名：[https://zhiwei.tianma-if.uk](https://zhiwei.tianma-if.uk)
- 部署平台：`Vercel`

## 当前能力

当前版本已完成第一阶段基础设施与核心链路：

- Google OAuth 登录入口已接入 `Better Auth`
- 主数据库使用 `Neon Postgres`
- 用户业务档案表 `public.users` 已预留 `stripe_customer_id`、`subscription_status`、`credits`
- 测算记录表 `public.divinations` 已支持保存输入参数、排盘 JSON、AI 输出
- 博客表 `public.posts` 与 `/api/automation/publish-blog` 已预留自动化 SEO 入口
- `/api/webhooks/stripe` 已预留 `Stripe Webhook` 路由
- 八字排盘与基础工作台 UI 已接入
- 紫微斗数 `4 x 4` 中空环形网格 UI 已接入
- AI 解盘支持流式输出

## 国际化预留

未来需要支持繁体中文、英文、日文与韩文，因此在新增页面、组件、文案与数据结构时，需要预留多语言支持入口。

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

## 后台脚手架

当前后台工作台以 [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) 作为后台脚手架母体来开发。

- 优先复用其成熟的 `dashboard shell / sidebar / page container / data page` 一类后台骨架
- 仅保留当前项目真正需要的组件与布局约定
- 未整体照搬其业务模块、鉴权体系、SaaS 信息架构或演示页面
- 命理业务页面、排盘流程、数据模型与产品视觉方向仍以本项目自身需求为主

## 本地开发

### 包管理器

项目统一使用 `pnpm`：

- 锁文件为 `pnpm-lock.yaml`
- 安装、开发、构建、Lint 均使用 `pnpm`
- 默认不再使用 `npm`

如果本机还没启用 `pnpm`，建议先执行：

```bash
corepack enable
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
GOOGLE_CLIENT_ID_LOCAL=
GOOGLE_CLIENT_SECRET_LOCAL=

AI_PROVIDER=openai-compatible
AI_MODEL=deepseek/deepseek-v4-pro
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=

AUTOMATION_API_KEY=
```

说明：

- `DATABASE_URL`：`Neon Postgres` 连接串
- `BETTER_AUTH_SECRET`：至少 32 位高强度随机字符串
- `BETTER_AUTH_URL`：当前应用地址，本地默认 `http://localhost:5555`
- `GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET`：Google OAuth 凭据
- `GOOGLE_CLIENT_ID_LOCAL / GOOGLE_CLIENT_SECRET_LOCAL`：可选，本地开发专用 Google OAuth 凭据；如果配置，则 `localhost` 会优先使用这一组，避免和线上 client 共用导致 One Tap / origin 校验不稳定
- `AI_PROVIDER`：
  - `gateway` 表示走 AI Gateway 风格的模型名
  - `openai-compatible` 表示走 OpenRouter 或其他 OpenAI 兼容接口
- `AI_BASE_URL`：如果使用 `openai-compatible`，OpenRouter 可填写 `https://openrouter.ai/api/v1`
- `AUTOMATION_API_KEY`：保护 `/api/automation/publish-blog`

### 安装与启动

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

打开：

- [http://localhost:5555](http://localhost:5555)

常用检查命令：

```bash
pnpm lint
pnpm build
```

补充说明：

- 本地默认地址为 `http://localhost:5555`
- 鉴权相关环境变量如果误拉成生产域名，开发环境会优先回退到本地地址，避免 Google OAuth 出现 `Invalid origin`

## UI 与组件约定

当前项目的基础 UI 组件已按 `shadcn/ui` 方式落地到仓库源码中，而不是依赖一个运行时 UI 包。

- 组件源码位于 `src/components/ui`
- 组件配置文件为 `components.json`
- 底层 primitive 以 `Radix UI` 为主
- 页面层视觉允许保留项目自己的卡片圆角、边框与 hover 动画，不强制套用默认展示风格
- 实现新 UI 时优先复用已有组件，而不是重新造轮子

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

初始化 SQL 基线在：

- [db/migrations/0001_init.sql](/D:/myLocalGithub/zhiwei/db/migrations/0001_init.sql)

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
AI_MODEL=deepseek/deepseek-v4-pro
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=your_openrouter_key
```

对应实现入口：

- [src/lib/ai/provider.ts](/D:/myLocalGithub/zhiwei/src/lib/ai/provider.ts)
- 预设 Prompt 模板位于 [src/lib/ai/divination-prompts](D:/myLocalGithub/zhiwei/src/lib/ai/divination-prompts)
- Prompt 输入组装位于 [src/lib/ai/divination-prompt-input.ts](D:/myLocalGithub/zhiwei/src/lib/ai/divination-prompt-input.ts)

如果没有配置 AI 相关环境变量，`/api/ai/divination` 会返回占位文本，而不是直接报错。

## 部署与远端资源

### Neon

当前已对接的 Neon 项目：

- Project: `zhiwei`
- Project ID: `late-water-70564475`
- Branch: `production`
- Database: `neondb`

已确认该项目上 `Neon Auth` 处于 provision 状态。

## 下一步计划

- 补上 `Better Auth` 的正式 schema/migrate 流程，避免只依赖手写 SQL
- 基于现有 `Better Auth + Google OAuth` 登录链路，完成生产回调配置核对与一次完整登录验收
- 把积分扣减与 Stripe 订阅状态真正落库
- 为博客自动化发布落地 `Markdown + 受控组件嵌入` 方案：正文继续以 Markdown 为主，仅白名单开放盘面层组件嵌入，优先服务 SEO 稳定收录与批量发文
- 在现有三式、六爻、梅花与称骨基础上，继续补强盘面展示细节、预填充体验与 AI 解读模板
