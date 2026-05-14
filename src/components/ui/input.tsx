import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-fire aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-fire/15",
        className,
      )}
      {...props}
    />
  );
}
