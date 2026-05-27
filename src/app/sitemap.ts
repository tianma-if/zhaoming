import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/posts";
import { getAppBaseUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const baseUrl = getAppBaseUrl() ?? "https://www.zhaoming.app";

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/pricing` },
    { url: `${baseUrl}/terms-of-service` },
    { url: `${baseUrl}/privacy-policy` },
    { url: `${baseUrl}/refund-policy` },
    { url: `${baseUrl}/blog` },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at,
    })),
  ];
}
