import * as React from "react";
import { DayPicker } from "react-day-picker";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={zhCN}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        month_caption: "flex items-center justify-center gap-1 pt-1 text-sm font-medium",
        caption_label:
          "inline-flex h-8 items-center gap-1 rounded-md px-1 text-sm font-medium text-foreground",
        dropdowns: "inline-flex items-center gap-1",
        dropdown_root:
          "relative inline-flex h-8 items-center overflow-hidden rounded-md border border-transparent bg-background text-sm font-medium text-foreground shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-within:border-border",
        dropdown:
          "absolute inset-0 cursor-pointer opacity-0",
        months_dropdown: "pr-6 pl-2",
        years_dropdown: "pr-6 pl-2",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute left-1 h-8 w-8 rounded-md p-0",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute right-1 h-8 w-8 rounded-md p-0",
        ),
        chevron: "size-4 shrink-0 opacity-70",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground",
        week: "mt-2 flex w-full",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button:
          "h-9 w-9 rounded-md p-0 font-normal transition-colors hover:bg-accent hover:text-accent-foreground",
        selected:
          "bg-foreground text-background hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background",
        today: "bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
