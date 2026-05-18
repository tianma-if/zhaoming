import { Badge } from "@/components/ui/badge";
import { wuxingColorMap } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function WuxingBadge({ element }: { element: string }) {
  return (
    <Badge
      className={cn(
        "gap-1.5 px-2.5 font-medium tracking-[0.18em] shadow-none before:size-1.5 before:shrink-0 before:rounded-full before:content-['']",
        wuxingColorMap[element] ?? "",
      )}
    >
      {element}
    </Badge>
  );
}
