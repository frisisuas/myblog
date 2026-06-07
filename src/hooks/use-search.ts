import { useMemo } from "react";
import Fuse from "fuse.js";
import type { BlogPost } from "@/data/posts";

const fuseOptions: Fuse.IFuseOptions<BlogPost> = {
  threshold: 0.4,
  keys: [
    { name: "title", weight: 0.5 },
    { name: "subtitle", weight: 0.3 },
    { name: "tags", weight: 0.2 },
  ],
};

export function useSearch(
  query: string,
  posts: BlogPost[]
): BlogPost[] {
  const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);

  return useMemo(() => {
    if (!query.trim()) {
      // Empty query → show most recent (up to 6)
      return posts.slice(0, 6);
    }
    return fuse
      .search(query)
      .map((r) => r.item)
      .slice(0, 6);
  }, [query, fuse, posts]);
}
