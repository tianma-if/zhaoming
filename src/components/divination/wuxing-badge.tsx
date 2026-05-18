import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { wuxingPalette } from "@/lib/constants";
import { cn } from "@/lib/utils";

const defaultPalette = {
  bg: "#f6f6f4",
  border: "#d8d2c5",
  text: "#6e6a64",
  accent: "#8f7957",
};

export function WuxingBadge({ element }: { element: string }) {
  const palette = wuxingPalette[element] ?? defaultPalette;
  const style = {
    "--wuxing-bg": palette.bg,
    "--wuxing-border": palette.border,
    "--wuxing-text": palette.text,
    "--wuxing-accent": palette.accent,
  } as CSSProperties;

  return (
    <Badge
      style={style}
      className={cn(
        "gap-1.5 border-[var(--wuxing-border)] bg-[var(--wuxing-bg)] px-2.5 font-medium tracking-[0.18em] text-[var(--wuxing-text)] shadow-none before:size-1.5 before:shrink-0 before:rounded-full before:bg-[var(--wuxing-accent)] before:content-['']",
      )}
    >
      {element}
    </Badge>
  );
}
