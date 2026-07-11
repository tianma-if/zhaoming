"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDashboardBreadcrumbs } from "@/config/dashboard-nav";
import { useI18n } from "@/components/i18n-provider";

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = getDashboardBreadcrumbs(pathname);
  const { t } = useI18n();
  const labels: Record<string, string> = {
    首页: "dashboard.home", 测算记录: "dashboard.records", 新建测算: "dashboard.new", 紫微排盘: "dashboard.ziwei", 袁天罡称骨: "dashboard.chenggu", 六爻占卜: "dashboard.liuyao", 梅花易数: "dashboard.meihua", 三式占卜: "dashboard.sanshi", 个人资料: "dashboard.profile", 解盘详情: "dashboard.detail",
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{labels[item.label] ? t(labels[item.label]) : item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{labels[item.label] ? t(labels[item.label]) : item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
