"use client";

import type { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  labels?: Record<string, string>;
}

export function DataTableViewOptions<TData>({
  table,
  labels = {},
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 rounded-md">
          <SlidersHorizontal className="size-4" />
          视图
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>显示列</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {labels[column.id] ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
