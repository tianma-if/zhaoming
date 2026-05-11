export const siteConfig = {
  name: "知微",
  description: "传统命理排盘与现代大模型解读的极简交汇点。",
  nav: [
    { href: "/", label: "首页" },
    { href: "/pricing", label: "定价" },
    { href: "/blog", label: "博客" },
    { href: "/dashboard", label: "工作台" },
  ],
} as const;

export const protectedPrefixes = ["/dashboard", "/divinations", "/profile"];

export const wuxingColorMap: Record<string, string> = {
  木: "bg-wood/12 text-wood border-wood/20",
  火: "bg-fire/12 text-fire border-fire/20",
  土: "bg-earth/12 text-earth border-earth/20",
  金: "bg-metal/12 text-metal border-metal/20",
  水: "bg-water/12 text-water border-water/20",
};
