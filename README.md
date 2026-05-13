# 知微

`知微` 是一个基于 `Next.js App Router` 构建的 AI 传统命理 SaaS 原型。

当前版本已经完成第一阶段基础设施：

- `Neon Postgres` 作为主数据库
- `Better Auth` 作为应用鉴权层
- `Neon Auth` 已在远端项目中 provision，可作为后续托管鉴权能力入口
- `Vercel AI SDK` 作为 AI 解读层
- `lunar-typescript` 负责八字排盘
- `iztro` 负责紫微斗数排盘

界面风格走极简、低饱和、排印优先路线，避免传统算命站视觉语言。

## 在线访问

- 生产域名：[https://zhiwei.tianma-if.uk](https://zhiwei.tianma-if.uk)
- 部署平台：`Vercel`

## 当前能力

- Google OAuth 登录入口已接入 Better Auth
- 用户业务档案表 `public.users` 已预留 `stripe_customer_id`、`subscription_status`、`credits`
- 测算记录表 `public.divinations` 已支持保存输入参数、排盘 JSON、AI 输出
- 博客表 `public.posts` 与 `/api/automation/publish-blog` 已预留自动化 SEO 入口
- `/api/webhooks/stripe` 已预留 Stripe Webhook 路由
- 八字极简排盘 UI 已完成
- 紫微斗数 `4 x 4` 中空环形网格 UI 已完成
- AI 解盘支持流式输出

## 技术栈

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Better Auth`
- `Neon Postgres`
- `Vercel AI SDK`
- `lunar-typescript`
- `iztro`

## 环境变量

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

AI_PROVIDER=gateway
AI_MODEL=openai/gpt-5.4
AI_BASE_URL=
AI_API_KEY=

AUTOMATION_API_KEY=
```

说明：

- `DATABASE_URL`：Neon Postgres 连接串
- `BETTER_AUTH_SECRET`：至少 32 位高强度随机字符串
- `BETTER_AUTH_URL`：当前应用地址，本地默认 `http://localhost:5555`
- `GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET`：Google OAuth 凭据
- `AI_PROVIDER`：
  - `gateway` 表示走 AI Gateway 风格的模型名
  - `openai-compatible` 表示走自定义 OpenAI 兼容接口
- `AUTOMATION_API_KEY`：保护 `/api/automation/publish-blog`

## 数据库结构

认证相关表由 Better Auth / Neon Auth 使用：

- `neon_auth.user`
- `neon_auth.session`
- `neon_auth.account`
- `neon_auth.verification`

业务表位于 `public`：

- `public.users`
- `public.divinations`
- `public.posts`

初始化 SQL 基线在：

- [supabase/migrations/0001_init.sql](/D:/myLocalGithub/zhiwei/supabase/migrations/0001_init.sql)

虽然目录名还叫 `supabase/migrations`，但内容已经迁移为 `Neon + Better Auth` 版本，后面可以再顺手改名成 `db/migrations`。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开：

- [http://localhost:5555](http://localhost:5555)

常用检查命令：

```bash
npm run lint
npm run build
```

## 鉴权说明

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

## AI Provider 说明

项目支持两种模式：

1. `AI_PROVIDER=gateway`
2. `AI_PROVIDER=openai-compatible`

对应实现入口：

- [src/lib/ai/provider.ts](/D:/myLocalGithub/zhiwei/src/lib/ai/provider.ts)

如果没有配置 AI 相关环境变量，`/api/ai/divination` 会返回占位文本，而不是直接报错。

## 关键目录

```text
src/
  app/
    (marketing)/
    (auth)/
    (dashboard)/
    api/
  components/
  lib/
    ai/
    auth/
    divination/
    blog/
    db.ts
    auth.ts
    auth-client.ts
  types/
supabase/
  migrations/
```

## 远端 Neon 项目

当前已对接的 Neon 项目是：

- Project: `zhiwei`
- Project ID: `late-water-70564475`
- Branch: `production`
- Database: `neondb`

已确认该项目上 `Neon Auth` 处于 provision 状态。

## 下一步建议

- 把 README 里的迁移目录名从 `supabase/migrations` 改成更中性的 `db/migrations`
- 补上 Better Auth 的正式 schema/migrate 流程，避免只依赖手写 SQL
- 接通真实 Google OAuth 后做一次完整登录验收
- 把积分扣减与 Stripe 订阅状态真正落库
- 继续扩展奇门遁甲、梅花易数等适配器
