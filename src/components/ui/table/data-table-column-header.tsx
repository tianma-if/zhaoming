"use client";

import type { Column } from "@tanstack/react-table";
import type * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();
  const SortIcon = sorted === "desc" ? ArrowDown : sorted === "asc" ? ArrowUp : ChevronsUpDown;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-md px-2 text-foreground"
          >
            <span>{title}</span>
            <SortIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="size-4" />
            升序
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="size-4" />
            降序
          </DropdownMenuItem>
          {column.getCanHide() ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="size-4" />
                隐藏
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
