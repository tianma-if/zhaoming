import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/posts";
import { getAppBaseUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const baseUrl = getAppBaseUrl() ?? "https://zhaoming.app";

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/pricing` },
    { url: `${baseUrl}/blog` },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at,
    })),
  ];
}
