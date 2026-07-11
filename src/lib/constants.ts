export const siteConfig = {
  name: "照命",
  description: "传统命理排盘与现代大模型解读的极简交汇点。",
  githubUrl: "https://github.com/tianma-if/zhaoming",
  nav: [
    { href: "/", label: "首页" },
    { href: "/blog", label: "博客" },
    { href: "/divinations", label: "工作台" },
  ],
} as const;

export const protectedPrefixes = ["/dashboard", "/divinations", "/profile"];

export const wuxingPalette: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    accent: string;
  }
> = {
  木: {
    bg: "#eaf8e9",
    border: "#9fd39f",
    text: "#23843a",
    accent: "#36a853",
  },
  火: {
    bg: "#fff0ee",
    border: "#f0aca2",
    text: "#c24130",
    accent: "#ef5b43",
  },
  土: {
    bg: "#fff7df",
    border: "#dfc36f",
    text: "#9a6b13",
    accent: "#d89a1d",
  },
  金: {
    bg: "#f1f5f8",
    border: "#b6c0ca",
    text: "#4f6475",
    accent: "#7890a4",
  },
  水: {
    bg: "#eaf7fd",
    border: "#8dc8e8",
    text: "#1976a3",
    accent: "#2f9fd1",
  },
};
