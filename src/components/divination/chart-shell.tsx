import type { ReactNode } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function ChartShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[1.6rem] border border-border bg-white shadow-none">
      <div className="relative space-y-5">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">{title}</CardTitle>
          <CardDescription className="text-sm leading-7">{description}</CardDescription>
        </div>
        {children}
      </div>
    </Card>
  );
}
