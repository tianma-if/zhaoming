import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/prose/markdown-renderer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPostBySlug } from "@/lib/blog/posts";
import { formatDateTime } from "@/lib/utils";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <Card className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge>{post.source}</Badge>
              <span className="text-xs tracking-[0.2em] text-muted-foreground">
                {formatDateTime(post.published_at)}
              </span>
            </div>
            <h1 className="font-display text-6xl tracking-[0.06em]">{post.title}</h1>
            <p className="text-sm leading-8 text-muted-foreground">
              {post.meta_description}
            </p>
          </div>
          <MarkdownRenderer content={post.content} />
        </Card>
      </section>
      <SiteFooter />
    </main>
  );
}
