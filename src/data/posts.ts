import grayMatter from "gray-matter";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "code"; language: string; filename?: string; code: string }
  | {
      type: "annotated-image";
      src: string;
      alt: string;
      caption: string;
      callouts: { x: number; y: number; label: string }[];
    }
  | { type: "quote"; text: string; author?: string }
  | { type: "divider" };

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  /** Raw markdown content (body after frontmatter) */
  content: string;
}

// Load all markdown posts via Vite's import.meta.glob
// Each file is imported as raw text at build time
const modules = import.meta.glob("/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parsePost(filePath: string, raw: string): BlogPost {
  const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
  const { data, content } = grayMatter(raw);

  return {
    slug,
    title: data.title ?? slug,
    subtitle: data.subtitle ?? "",
    date: data.date ?? "",
    readTime: data.readTime ?? "",
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? "",
    content: content.trim(),
  };
}

export const BLOG_POSTS: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => {
    // Sort by date descending (most recent first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
