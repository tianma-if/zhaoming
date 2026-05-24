"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Sparkles } from "lucide-react";
import { useState, useSyncExternalStore, useTransition } from "react";
import { GoogleOneTapPrompt } from "@/components/auth/google-one-tap-prompt";
import { DivinationChartRenderer } from "@/components/divination/divination-chart-renderer";
import {
  DashboardEmptyState,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  clearDivinationPreview,
  loadDivinationPreview,
  type DivinationCreateResponse,
} from "@/lib/divination/preview";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { formatDateTime } from "@/lib/utils";

const divinationTitleMap: Record<string, string> = {
  bazi: "八字解盘",
  ziwei: "紫微斗数解盘",
  chenggu: "称骨结果",
  liuyao: "六爻解卦",
  meihua: "梅花易数解卦",
  sanshi: "三式解局",
};

function subscribeToPreviewStorage() {
  return () => {};
}

function getPreviewSnapshot() {
  return loadDivinationPreview();
}

function getServerPreviewSnapshot() {
  return null;
}

export function DivinationPreview({ googleClientId }: { googleClientId: string | null }) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const preview = useSyncExternalStore(
    subscribeToPreviewStorage,
    getPreviewSnapshot,
    getServerPreviewSnapshot,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSaveAndGenerate() {
    if (!preview) {
      return;
    }

    setSubmitError(null);

    startTransition(async () => {
      const response = await fetch("/api/divination/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preview.input_params),
      });

      const payload = (await response.json().catch(() => null)) as
        | DivinationCreateResponse
        | { error?: string }
        | null;

      if (!response.ok || !payload || !("divination" in payload) || !payload.persisted) {
        setSubmitError(
          payload && "error" in payload && payload.error
            ? payload.error
            : "保存命盘失败，请稍后再试。",
        );
        return;
      }

      clearDivinationPreview();
      router.push(`/divinations/${payload.divination.id}?ai=1`);
      router.refresh();
    });
  }

  if (!preview) {
    return (
      <DashboardPage width="narrow">
        <DashboardEmptyState
          title="还没有临时命盘"
          description="先完成一次基础排盘，就可以在这里查看结果；AI 深度解读会在登录后继续。"
          action={
            <Button asChild>
              <Link href="/divinations/new">去排盘</Link>
            </Button>
          }
        />
      </DashboardPage>
    );
  }

  const divinationType = resolveDivinationTypeFromRecord(preview as Parameters<typeof resolveDivinationTypeFromRecord>[0]);

  return (
    <DashboardPage
      width={divinationType === "ziwei" ? "wide" : "default"}
      className={divinationType === "ziwei" ? "max-w-6xl" : undefined}
    >
      <DashboardPageHeader
        eyebrow={<Badge>Preview</Badge>}
        title={divinationTitleMap[divinationType] ?? "基础排盘结果"}
        description={
          <span className="text-xs text-muted-foreground">
            基础排盘已生成：{formatDateTime(preview.created_at)}
          </span>
        }
        action={
          session?.user ? (
            <div className="space-y-2">
              <Button
                className="h-12 rounded-2xl bg-foreground px-5 text-sm font-medium text-background shadow-[0_18px_38px_-20px_rgba(15,23,42,0.65)] transition-all hover:-translate-y-0.5 hover:bg-foreground/92"
                disabled={isPending}
                onClick={handleSaveAndGenerate}
                type="button"
              >
                <Sparkles className="size-4" />
                {isPending ? "正在保存..." : "保存并生成 AI 解读"}
              </Button>
              {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
            </div>
          ) : (
            <Button
              asChild
              className="h-12 rounded-2xl bg-foreground px-5 text-sm font-medium text-background shadow-[0_18px_38px_-20px_rgba(15,23,42,0.65)] transition-all hover:-translate-y-0.5 hover:bg-foreground/92"
              disabled={isSessionPending}
            >
              <Link href="/login?callbackURL=/divinations/preview">
                <LockKeyhole className="size-4" />
                登录生成 AI 解读
              </Link>
            </Button>
          )
        }
      />

      <GoogleOneTapPrompt
        callbackURL="/divinations/preview"
        clientId={googleClientId}
        enabled={!session?.user && Boolean(preview)}
      />

      <div className="space-y-6">
        <DivinationChartRenderer record={preview} />
      </div>
    </DashboardPage>
  );
}
