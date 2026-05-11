import { revalidatePath } from "next/cache";

export function revalidateBlogRoutes(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}
