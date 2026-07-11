import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/blog/posts";
import { formatDateTime } from "@/lib/utils";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const locale = await getLocale();

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.36em] text-muted-foreground">EDITORIAL</p>
          <h1 className="font-display text-6xl tracking-[0.06em]">{translate(locale, "blog.title")}</h1>
          <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
            `/api/automation/publish-blog` 已预留给外部自动化脚本写入 Markdown，并在发布后触发 ISR。
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          {posts.length ? (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="space-y-4 hover:bg-white/82">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{post.source}</Badge>
                    <span className="text-xs tracking-[0.2em] text-muted-foreground">
                      {formatDateTime(post.published_at)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-4xl tracking-[0.04em]">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {post.meta_description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <p className="text-sm leading-8 text-muted-foreground">
                {translate(locale, "blog.empty")}
              </p>
            </Card>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
