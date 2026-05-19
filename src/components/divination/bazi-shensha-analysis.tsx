import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

const shenShaStages: Record<string, string> = {
  year: "祖辈童年",
  month: "父母青年",
  day: "自身配偶",
  time: "子女晚年",
};
const shenShaNotes: Record<string, string> = {
  天德: "德性护持，遇事多有缓冲。",
  月德: "处世温厚，利人缘与贵人。",
  官日: "重秩序与职责，利规范事务。",
  六合: "关系协调，利合作与整合。",
  不将: "婚嫁与人际取象较平顺。",
  续世: "延续、承接与稳定性增强。",
  鸣吠对: "消息往来、人事响应较明显。",
  天吏: "事务压力与规训感增强。",
  致死: "凶煞取象，宜谨慎处理风险。",
  血支: "注意血光、磕碰或外伤取象。",
  土符: "土气阻滞，注意拖延与沉重感。",
  归忌: "归纳、收束之事需谨慎。",
  血忌: "不宜轻忽外伤、手术类象。",
  天刑: "刑罚、规则、压力类象明显。",
};

function getShenShaType(label: string) {
  if (label.includes("吉神")) {
    return "吉";
  }

  if (label.includes("凶") || label.includes("煞")) {
    return "煞";
  }

  if (label.includes("冲")) {
    return "冲";
  }

  return "神";
}

export function BaziShenShaAnalysis({ view }: { view: BaziViewModel }) {
  const shenShaItems = view.shenSha.flatMap((group) =>
    group.values.map((item) => ({
      name: item,
      type: getShenShaType(group.label),
      note: shenShaNotes[item.replace(/（.*$/, "")] ?? "用于补充取象与事件倾向。",
    })),
  );
  const shenShaColumns = view.pillars.map((pillar, pillarIndex) => ({
    key: pillar.key,
    label: pillar.label,
    stage: shenShaStages[pillar.key],
    items: shenShaItems.filter((_, itemIndex) => itemIndex % view.pillars.length === pillarIndex),
  }));

  return (
    <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
      <div className="space-y-2">
        <CardTitle className="text-3xl tracking-[0.04em]">神煞分析</CardTitle>
        <CardDescription className="text-sm leading-7">
          神煞仅作辅助参考，不宜单独论吉凶。
        </CardDescription>
      </div>
      <Separator />
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <p className="font-medium">神煞分布与影响</p>
          <span className="inline-flex size-5 items-center justify-center rounded-full border border-foreground text-xs font-semibold">
            i
          </span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[64rem] grid-cols-4 gap-5">
            {shenShaColumns.map((column) => (
              <section key={column.key} className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold tracking-[0.04em]">{column.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{column.stage}</p>
                </div>
                <div className="space-y-2.5">
                  {column.items.map((item) => (
                    <article
                      key={`${column.key}-${item.name}`}
                      className="grid min-h-[4.75rem] grid-cols-[minmax(0,1fr)_2.25rem] gap-3 rounded-lg border border-border bg-white px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold leading-6">{item.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {item.note}
                        </p>
                      </div>
                      <span className="inline-flex size-8 items-center justify-center rounded-md bg-foreground text-sm font-semibold text-background">
                        {item.type}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
