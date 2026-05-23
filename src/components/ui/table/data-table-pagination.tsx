"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        共 {table.getFilteredRowModel().rows.length} 条记录
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">每页</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-24 text-center text-sm font-medium">
            第 {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1} 页
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden size-9 rounded-md p-0 sm:inline-flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="第一页"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-9 rounded-md p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="上一页"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-9 rounded-md p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="下一页"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden size-9 rounded-md p-0 sm:inline-flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="最后一页"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
