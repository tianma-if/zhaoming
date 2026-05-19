import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CopyContentButton } from "./copy-content-button";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;
type BaziPillarView = BaziViewModel["pillars"][number];

function formatPillarsCopy(pillars: BaziPillarView[]) {
  return [
    "八字详解",
    ...pillars.map((pillar) =>
      [
        `${pillar.label}：${pillar.ganZhi}`,
        `天干五行：${pillar.elements[0] ?? "-"}`,
        `地支五行：${pillar.elements[1] ?? "-"}`,
        `十神：${pillar.shiShenGan || "-"}`,
        `纳音：${pillar.naYin || "-"}`,
      ].join("\n"),
    ),
  ].join("\n\n");
}

export function BaziPillarsInfoCard({
  baziText,
  pillars,
}: {
  baziText: string;
  pillars: BaziPillarView[];
}) {
  const copyText = formatPillarsCopy(pillars);

  return (
    <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl tracking-[0.04em]">八字详解</CardTitle>
          <CardDescription>
            八字的每一柱都由天干和地支组成，每一柱都有其特定的五行属性。
          </CardDescription>
        </div>
        <CopyContentButton label="复制八字" text={`${baziText}\n\n${copyText}`} />
      </div>

      <div className="grid gap-6 text-center [grid-template-columns:repeat(auto-fit,minmax(min(100%,8.5rem),1fr))]">
        {pillars.map((pillar) => (
          <article key={pillar.key} className="space-y-3">
            <p className="text-sm text-muted-foreground">{pillar.label}</p>
            <p className="font-display text-3xl">{pillar.ganZhi}</p>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">天干五行：</dt>
                <dd className="font-medium">{pillar.elements[0]}</dd>
              </div>
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">地支五行：</dt>
                <dd className="font-medium">{pillar.elements[1]}</dd>
              </div>
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">十神：</dt>
                <dd className="font-medium">{pillar.shiShenGan || "-"}</dd>
              </div>
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">纳音：</dt>
                <dd className="font-medium">{pillar.naYin || "-"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Card>
  );
}
