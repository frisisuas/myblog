import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Contact } from "@/components/contact";
import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/data/blog-posts";

export default function Blog() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-40 pb-20 px-6 md:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
                Writing
              </p>
              <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight mb-6">
                Design thinking,<br />
                <span className="text-muted-foreground">written out loud.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Case studies, code walkthroughs, and candid reflections on the decisions behind the work.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Divider line */}
        <div className="container mx-auto max-w-5xl px-6 md:px-12">
          <div className="border-t border-border" />
        </div>

        {/* Posts grid */}
        <section className="py-20 px-6 md:px-12">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
    </div>
  );
}
