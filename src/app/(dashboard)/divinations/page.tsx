import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  DashboardEmptyState,
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth/session";
import { listDivinations } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "测算记录",
};

const divinationTypeLabelMap: Record<string, string> = {
  bazi: "八字",
  ziwei: "紫微斗数",
  chenggu: "称骨",
  liuyao: "六爻",
  sanshi: "三式",
};

export default async function DivinationsPage() {
  const user = await requireUser();
  const data = await listDivinations(user.id);

  return (
    <DashboardPage width="wide">
      <DashboardPageHeader
        eyebrow="History"
        title="测算记录"
        description="这里汇总你已经生成过的命理与占卜结果，后续扩展筛选、分页和更多状态字段时，可以直接在这张表上继续生长。"
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">发起新测算</Link>
          </Button>
        }
      />
      <DashboardSection className="overflow-hidden p-0" title="全部记录">
        {data?.length ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>类型</TableHead>
                <TableHead>问题</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">查看</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {divinationTypeLabelMap[resolveDivinationTypeFromRecord(item)] ??
                      resolveDivinationTypeFromRecord(item)}
                  </TableCell>
                  <TableCell className="max-w-xl">
                    <div className="line-clamp-2 leading-7">{item.question}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full bg-muted/40">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm" className="rounded-full">
                      <Link href={`/divinations/${item.id}`}>
                        打开
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6">
            <DashboardEmptyState
              title="还没有测算记录"
              description="先创建一条命盘或占卜记录，后面所有 AI 解读、比较和复看，都会从这里进入。"
              action={
                <Button asChild>
                  <Link href="/divinations/new">立即新建</Link>
                </Button>
              }
            />
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
