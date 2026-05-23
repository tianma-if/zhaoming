"use client";

import type { Table as TanstackTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type * as React from "react";
import { DataTablePagination } from "@/components/ui/table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  emptyMessage?: string;
}

export function DataTable<TData>({
  table,
  emptyMessage = "没有找到匹配结果。",
  children,
  className,
}: DataTableProps<TData>) {
  return (
    <div className={cn("flex flex-col", className)}>
      {children}
      <div className="overflow-hidden border-t">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/35">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-28 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
