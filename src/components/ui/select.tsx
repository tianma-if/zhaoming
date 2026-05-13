import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-foreground/25",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
