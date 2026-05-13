import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-foreground/25",
        className,
      )}
      {...props}
    />
  );
}
