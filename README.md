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

项目统一使用 `Bun` 作为包管理器。

### 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

根据 `.env.example` 文件中的注释说明，在 `.env.local` 中填写你的本地数据库、Better Auth 鉴权以及大模型等环境变量。

### 安装与启动

1. **安装依赖**：
   ```bash
   bun install
   ```
2. **初始化数据库**：
   - 生成/迁移 Better Auth 认证表：`bunx better-auth migrate`（若使用 Neon Auth 托管则在后台开启即可）。
   - 按文件名编号顺序依次执行 [db/migrations/](./db/migrations/) 目录下的业务 SQL 脚本。
3. **运行开发服务器**：
   ```bash
   bun run dev
   ```

本地默认访问地址为 `http://localhost:5555`。可以使用 `bun run lint` 或 `bun run build` 进行代码规范检查与编译。

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


## 未来路线 (Roadmap)

- 🔄 **数据库管理重构**：引入 Drizzle/Prisma 等 ORM 统一管理 Better Auth 与业务表的 Schema 迁移，逐步淘汰纯手写 SQL。
- 🧪 **算法补强与扩充**：在现有的三式、六爻、梅花、称骨基础上，继续丰富盘面细节展示逻辑。
- 🤖 **解读模板升级**：优化 AI 解读 Prompt，支持定制不同流派分析判词。
- 📝 **SEO 自动化博客**：进一步优化基于 Markdown 与白名单盘面组件嵌入的博客自动化发布机制，加速收录与流量沉淀。


## 鸣谢与致敬

本项目在设计灵感与工程实现上参考或使用了以下优秀项目，在此致以诚挚的感谢：

- **[FateMaster.AI](https://www.fatemaster.ai/)**：启发了本项目的产品定位与现代化交互设计理念。
- **[next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter)**：本项目后台工作台布局及骨架结构基于此进行定制与二次开发。

## 开源协议

本项目基于 **GNU Affero General Public License v3.0 (AGPL-3.0)** 协议开源。详情请参阅 [LICENSE](./LICENSE) 文件。
