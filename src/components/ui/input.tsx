import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-white/55 px-4 text-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-foreground/25 focus:bg-white",
        className,
      )}
      {...props}
    />
  );
}
