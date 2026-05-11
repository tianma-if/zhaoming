import { Badge } from "@/components/ui/badge";
import { wuxingColorMap } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function WuxingBadge({ element }: { element: string }) {
  return (
    <Badge className={cn("tracking-[0.28em]", wuxingColorMap[element] ?? "")}>
      {element}
    </Badge>
  );
}
