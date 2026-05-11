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
    <Card className="grain-mask overflow-hidden">
      <div className="relative space-y-5">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {children}
      </div>
    </Card>
  );
}
