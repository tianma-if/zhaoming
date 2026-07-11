import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardTitle } from "@/components/ui/card";
import { getBaziShenShaBrief } from "@/lib/divination/bazi-shensha-briefs";
import { useI18n } from "@/components/i18n-provider";

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
  const { t } = useI18n();
  return (
    <Card className="space-y-4 rounded-[1.6rem] border border-border bg-white">
      <div>
        <CardTitle className="text-2xl tracking-[0.04em]">{t("chart.spiritAnalysis")}</CardTitle>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {view.shenSha.map((group) => (
            <section key={group.label} className="space-y-2.5">
              <div className="text-center">
                <h3
                  className={[
                    "text-xl font-semibold tracking-[0.04em]",
                    getShenShaTitleClass(group.label),
                  ].join(" ")}
                >
                  {group.label}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{group.values.length} 项</p>
              </div>

              <div className="space-y-2">
                {group.values.map((item) => (
                  <article
                    key={`${group.label}-${item}`}
                    className="rounded-md border border-border bg-white px-2.5 py-2"
                  >
                    <p className="truncate text-base font-semibold leading-5">{item}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {getBaziShenShaBrief(item, group.label)}
                    </p>
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
