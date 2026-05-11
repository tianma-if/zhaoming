export interface PostInput {
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  tags?: string[];
  publishedAt?: string;
}
