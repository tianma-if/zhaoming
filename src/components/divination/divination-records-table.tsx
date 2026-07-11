"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpRight, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { DataTableViewOptions } from "@/components/ui/table/data-table-view-options";
import { formatDateTime } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

export interface DivinationRecordTableRow {
  id: string;
  type: string;
  typeLabel: string;
  subjectName: string;
  question: string;
  status: string;
  created_at: string;
}

interface DivinationRecordsTableProps {
  data: DivinationRecordTableRow[];
}

export function DivinationRecordsTable({ data }: DivinationRecordsTableProps) {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const typeOptions = useMemo(() => {
    return Array.from(new Map(data.map((item) => [item.type, item.typeLabel])).entries());
  }, [data]);

  const columns = useMemo<ColumnDef<DivinationRecordTableRow>[]>(
    () => [
      {
        accessorKey: "typeLabel",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("records.type")} />,
        cell: ({ row }) => <span className="font-medium">{row.original.typeLabel}</span>,
        filterFn: (row, _id, value) => row.original.type === value,
      },
      {
        accessorKey: "subjectName",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("records.subject")} />,
        cell: ({ row }) => <span>{row.original.subjectName || t("records.emptyName")}</span>,
      },
      {
        accessorKey: "question",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("records.question")} />,
        cell: ({ row }) => (
          <div className="max-w-xl whitespace-normal line-clamp-2 leading-7">
            {row.original.question}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("records.created")} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDateTime(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href={`/divinations/${row.original.id}`}>
                {t("records.open")}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        ),
      },
    ],
    [t],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const questionFilter = (table.getColumn("question")?.getFilterValue() as string) ?? "";
  const typeFilter = (table.getColumn("typeLabel")?.getFilterValue() as string) ?? "all";
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <DataTable table={table}>
      <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={questionFilter}
              onChange={(event) =>
                table.getColumn("question")?.setFilterValue(event.target.value)
              }
              placeholder={t("records.search")}
              className="pl-9"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              table.getColumn("typeLabel")?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder={t("records.type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("records.allTypes")}</SelectItem>
              {typeOptions.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFiltered ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 rounded-md"
              onClick={() => table.resetColumnFilters()}
            >
              <RotateCcw className="size-4" />
              {t("records.reset")}
            </Button>
          ) : null}
        </div>
        <DataTableViewOptions table={table} labels={{ typeLabel: t("records.type"), subjectName: t("records.subject"), question: t("records.question"), created_at: t("records.created") }} />
      </div>
    </DataTable>
  );
}
