import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[1px] w-12 bg-primary" />
            <p className="text-primary font-medium tracking-wide uppercase text-sm">Alex Chen</p>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8"
          >
            UI/UX Designer & <br className="hidden md:block" />
            <span className="text-muted-foreground">Creative Technologist</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12"
          >
            I build digital experiences that feel considered, precise, and quietly impressive. 
            Bridging the gap between ambitious design and flawless execution.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <a
              href="#work"
              className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-wider group"
            >
              <span>Explore Selected Work</span>
              <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-background transition-all duration-300">
                <ArrowDown className="w-4 h-4" />
              </div>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Abstract background element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
