import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@/data/blog-posts";
import { imageUrl } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`blog-card-${post.slug}`}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group relative rounded-2xl overflow-hidden border border-white/8 cursor-pointer transition-all duration-300 hover:border-white/16 hover:shadow-xl hover:shadow-black/40">
          {/* Cover image */}
          <div className="relative overflow-hidden h-52">
            <img
              src={imageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Tags overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                  style={{ background: "rgba(249,115,22,0.25)", border: "1px solid rgba(249,115,22,0.4)", color: "#fdba74" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6" style={{ background: "hsl(240 10% 6%)" }}>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
              <time>{post.date}</time>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg leading-snug mb-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {post.subtitle}
            </p>

            <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
              Read article
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
