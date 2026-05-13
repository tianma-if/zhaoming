import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateBlogRoutes } from "@/lib/blog/revalidate";
import { upsertAutomationPost } from "@/lib/data";
import { getEnv } from "@/lib/env";
import { slugify } from "@/lib/utils";

const publishSchema = z.object({
  slug: z.string().trim().optional(),
  title: z.string().trim().min(3),
  content: z.string().trim().min(20),
  metaDescription: z.string().trim().max(180).optional(),
  tags: z.array(z.string()).optional().default([]),
  publishedAt: z.string().optional(),
});

function isAuthorized(request: Request) {
  const env = getEnv();
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerKey = request.headers.get("x-automation-key");
  return env.AUTOMATION_API_KEY && [bearer, headerKey].includes(env.AUTOMATION_API_KEY);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = publishSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);

  const data = await upsertAutomationPost({
    slug,
    title: parsed.data.title,
    content: parsed.data.content,
    metaDescription: parsed.data.metaDescription ?? null,
    tags: parsed.data.tags,
    publishedAt: parsed.data.publishedAt ?? new Date().toISOString(),
  });

  revalidateBlogRoutes(slug);

  return NextResponse.json({ post: data });
}
