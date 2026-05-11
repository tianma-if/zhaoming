import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  return [
    { url: "https://example.com/" },
    { url: "https://example.com/pricing" },
    { url: "https://example.com/blog" },
    ...posts.map((post) => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updated_at,
    })),
  ];
}
