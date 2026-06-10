import { WuxingRadarChart, type WuxingRadarDatum } from "@/components/divination/wuxing-radar-chart";

export function BlogWuxingRadarEmbed({ data }: { data: WuxingRadarDatum[] }) {
  return (
    <section className="my-10 rounded-[1.6rem] border border-border bg-card px-4 py-5 shadow-sm md:px-6 md:py-6">
      <div className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold tracking-[0.04em] text-foreground">
          五行五维图
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          这里演示的是文章内嵌版组件，当前使用静态示例数据验证博客渲染效果。
        </p>
      </div>
      <WuxingRadarChart data={data} />
    </section>
  );
}
