import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Contact } from "@/components/contact";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { AnnotatedImage } from "@/components/blog/AnnotatedImage";
import { imageUrl } from "@/lib/utils";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPost, BLOG_POSTS } from "@/data/blog-posts";
import type { ContentBlock } from "@/data/blog-posts";
import NotFound from "@/pages/not-found";

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          {block.text}
        </p>
      );

    case "heading":
      if (block.level === 3) {
        return (
          <h3 className="font-display font-bold text-xl mt-10 mb-4 text-foreground">
            {block.text}
          </h3>
        );
      }
      return (
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-14 mb-5 text-foreground">
          {block.text}
        </h2>
      );

    case "code":
      return (
        <CodeBlock
          code={block.code}
          language={block.language}
          filename={block.filename}
        />
      );

    case "annotated-image":
      return (
        <AnnotatedImage
          src={imageUrl(block.src)}
          alt={block.alt}
          caption={block.caption}
          callouts={block.callouts}
        />
      );

    case "quote":
      return (
        <blockquote className="my-10 pl-6 border-l-2 border-primary">
          <p className="text-xl font-display font-medium italic text-foreground leading-relaxed mb-3">
            "{block.text}"
          </p>
          {block.author && (
            <cite className="text-sm text-muted-foreground not-italic font-mono">
              — {block.author}
            </cite>
          )}
        </blockquote>
      );

    case "divider":
      return <hr className="border-border my-12" />;

    default:
      return null;
  }
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) return <NotFound />;

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-white">
      <Navbar />

      <main>
        {/* Back button + meta */}
        <section className="pt-36 pb-12 px-6 md:px-12">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/blog">
                <button
                  data-testid="button-back-to-blog"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  All articles
                </button>
              </Link>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full font-mono"
                    style={{
                      background: "rgba(249,115,22,0.12)",
                      border: "1px solid rgba(249,115,22,0.3)",
                      color: "#fdba74",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-5">
                {post.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                {post.subtitle}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono border-t border-border pt-6">
                <time>{post.date}</time>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>Alex Chen</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cover image — full bleed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-5xl px-6 md:px-12 mb-16"
        >
          <div className="rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/60">
            <img
              src={imageUrl(post.coverImage)}
              alt={post.title}
              className="w-full object-cover"
              style={{ maxHeight: "520px", objectPosition: "top" }}
            />
          </div>
        </motion.div>

        {/* Article body */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-3xl px-6 md:px-12 pb-24"
        >
          {post.content.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </motion.article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="border-t border-border py-20 px-6 md:px-12">
            <div className="container mx-auto max-w-5xl">
              <h2 className="font-display font-bold text-2xl mb-10 text-muted-foreground">
                More from the blog
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((p, i) => (
                  <BlogCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        <Contact />
      </main>
    </div>
  );
}
