import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { BLOG_POSTS } from "@/data/posts";
import { imageUrl } from "@/lib/utils";
import type { BlogPost } from "@/data/posts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useSearch(query, BLOG_POSTS);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Focus input after animation frame
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Clamp selectedIndex when results change
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, Math.max(results.length - 1, 0)));
  }, [results.length]);

  const handleSelect = useCallback(
    (post: BlogPost) => {
      onNavigate(`/blog/${post.slug}`);
      onClose();
    },
    [onNavigate, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-xl mx-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
              style={{ background: "hsl(240 10% 6%)" }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/50 outline-none font-mono"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-muted-foreground border border-white/8 bg-white/4">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((post, i) => (
                      <button
                        key={post.slug}
                        data-testid={`search-result-${post.slug}`}
                        onClick={() => handleSelect(post)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full text-left flex items-start gap-4 px-5 py-3 transition-colors duration-100 ${
                          i === selectedIndex
                            ? "bg-white/8"
                            : "hover:bg-white/4"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/8">
                          <img
                            src={imageUrl(post.coverImage)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-foreground truncate">
                              {post.title}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                            {post.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full font-mono"
                                style={{
                                  background: "rgba(249,115,22,0.15)",
                                  border: "1px solid rgba(249,115,22,0.25)",
                                  color: "#fdba74",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Arrow indicator on hovered/selected */}
                        <ArrowRight
                          className={`w-4 h-4 mt-1 flex-shrink-0 transition-all duration-150 ${
                            i === selectedIndex
                              ? "text-primary opacity-100 translate-x-0"
                              : "text-muted-foreground/30 opacity-0 -translate-x-1"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      {query.trim()
                        ? `No articles matching "${query}"`
                        : "No articles found"}
                    </p>
                  </div>
                )}

                {/* Footer hint */}
                {results.length > 0 && (
                  <div className="px-5 py-3 border-t border-white/8">
                    <p className="text-xs text-muted-foreground/50 font-mono text-center">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-[10px]">↑↓</kbd> Navigate{" "}
                      <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-[10px]">↵</kbd> Open{" "}
                      <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-[10px]">ESC</kbd> Close
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
