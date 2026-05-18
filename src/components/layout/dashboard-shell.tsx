import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const pageWidthVariants = cva("mx-auto w-full", {
  variants: {
    width: {
      default: "max-w-6xl",
      wide: "max-w-7xl",
      narrow: "max-w-5xl",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

export function DashboardPage({
  className,
  width,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof pageWidthVariants>) {
  return (
    <section
      className={cn("space-y-8", pageWidthVariants({ width }), className)}
      {...props}
    />
  );
}

export function DashboardPageHeader({
  className,
  eyebrow,
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"header"> & {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 rounded-[2rem] border border-border/70 bg-linear-to-br from-white via-white to-muted/45 px-6 py-7 shadow-[0_18px_38px_-30px_rgba(22,20,17,0.24)] md:flex-row md:items-end md:justify-between md:px-8",
        className,
      )}
      {...props}
    >
      <div className="space-y-3">
        {eyebrow ? (
          <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {eyebrow}
          </div>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-[0.06em] text-foreground md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function DashboardSection({
  className,
  title,
  description,
  action,
  children,
  ...props
}: React.ComponentProps<typeof Card> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className={cn("space-y-6", className)} {...props}>
      {title || description || action ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            {title ? <CardTitle className="text-3xl tracking-[0.05em]">{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </Card>
  );
}

export function DashboardMetricCard({
  className,
  label,
  value,
  detail,
  ...props
}: React.ComponentProps<typeof Card> & {
  label: React.ReactNode;
  value: React.ReactNode;
  detail?: React.ReactNode;
}) {
  return (
    <Card
      className={cn("space-y-3 rounded-[1.5rem] border-border/70 bg-white/88 p-5", className)}
      {...props}
    >
      <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">{label}</p>
      <p className="font-display text-4xl tracking-[0.04em] text-foreground">{value}</p>
      {detail ? <p className="text-sm leading-7 text-muted-foreground">{detail}</p> : null}
    </Card>
  );
}

export function DashboardEmptyState({
  className,
  title,
  description,
  action,
  ...props
}: React.ComponentProps<"div"> & {
  title: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-dashed border-border bg-muted/35 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-xl space-y-3">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground">{title}</h2>
        <p className="text-sm leading-8 text-muted-foreground">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
