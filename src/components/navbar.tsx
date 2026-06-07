import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";

interface NavbarProps {
  onSearchOpen?: () => void;
}

export function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchOpen]);

  const links = [
    { name: "Work", href: "/#work" },
    { name: "About", href: "/#about" },
    { name: "Blog", href: "/blog", internal: true },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/">
          <span className="font-display font-bold text-xl tracking-tighter cursor-pointer">
            AC<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.name}>
                {link.internal ? (
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Search button */}
          <button
            onClick={onSearchOpen}
            data-testid="button-search-open"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/8"
            aria-label="Search articles (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
            <kbd className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/8 text-muted-foreground/70">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
