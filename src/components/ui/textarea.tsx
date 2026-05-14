import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-fire aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-fire/15",
        className,
      )}
      {...props}
    />
  );
}
