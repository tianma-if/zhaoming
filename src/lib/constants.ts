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
  木: "border-[#cfdacb] bg-[#f1f6ef] text-[#526b4f] before:bg-[#7f9a78]",
  火: "border-[#ead4cc] bg-[#f8eeee] text-[#8c5a52] before:bg-[#b97966]",
  土: "border-[#e3dac5] bg-[#f6f1e8] text-[#756650] before:bg-[#a49062]",
  金: "border-[#d7dadd] bg-[#f1f2f2] text-[#626870] before:bg-[#8c9298]",
  水: "border-[#cfdee5] bg-[#eef4f7] text-[#4f6874] before:bg-[#7896a4]",
};
