import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

function getShenShaTitleClass(label: string) {
  if (label.includes("吉神")) {
    return "text-emerald-700";
  }

  if (label.includes("凶") || label.includes("煞")) {
    return "text-rose-700";
  }

  return "text-sky-700";
}

export function BaziShenShaAnalysis({ view }: { view: BaziViewModel }) {
  return (
    <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {view.shenSha.map((group) => (
            <section key={group.label} className="space-y-4">
              <div className="text-center">
                <h3
                  className={[
                    "text-2xl font-semibold tracking-[0.04em]",
                    getShenShaTitleClass(group.label),
                  ].join(" ")}
                >
                  {group.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {group.values.length} 项
                </p>
              </div>
              <div className="space-y-2.5">
                {group.values.map((item) => (
                  <article
                    key={`${group.label}-${item}`}
                    className="rounded-lg border border-border bg-white px-3 py-3"
                  >
                    <p className="truncate text-lg font-semibold leading-6">{item}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Card>
  );
}
