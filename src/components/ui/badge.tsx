import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white/72 px-2.5 py-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}
