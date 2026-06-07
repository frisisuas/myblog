import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Callout {
  x: number;
  y: number;
  label: string;
}

interface AnnotatedImageProps {
  src: string;
  alt: string;
  caption: string;
  callouts: Callout[];
}

export function AnnotatedImage({ src, alt, caption, callouts }: AnnotatedImageProps) {
  const [activeCallout, setActiveCallout] = useState<number | null>(null);

  return (
    <figure className="my-12 not-prose">
      {/* Browser chrome frame */}
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
        {/* Browser top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-white/8"
          style={{ background: "hsl(240 10% 9%)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div
            className="flex-1 mx-4 h-6 rounded-md flex items-center px-3 text-xs text-muted-foreground font-mono"
            style={{ background: "hsl(240 10% 13%)" }}
          >
            <span className="opacity-50 mr-1">🔒</span> app.alexchen.design
          </div>
        </div>

        {/* Image with callout markers */}
        <div className="relative overflow-hidden" style={{ background: "hsl(240 10% 7%)" }}>
          <img
            src={src}
            alt={alt}
            className="w-full object-cover block"
            style={{ maxHeight: "480px", objectPosition: "top" }}
          />

          {/* Overlay tint on hover */}
          <div
            className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none"
          />

          {/* Callout markers */}
          {callouts.map((callout, i) => (
            <button
              key={i}
              data-testid={`callout-marker-${i + 1}`}
              className="absolute z-10 focus:outline-none"
              style={{
                left: `${callout.x}%`,
                top: `${callout.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setActiveCallout(activeCallout === i ? null : i)}
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  border-2 border-white/20 shadow-lg shadow-black/50
                  transition-all duration-150 cursor-pointer
                  ${activeCallout === i
                    ? "bg-primary text-white border-primary scale-110"
                    : "bg-black/70 text-white hover:bg-primary hover:border-primary backdrop-blur-sm"
                  }
                `}
              >
                {i + 1}
              </motion.div>

              {/* Pulse ring for non-active callouts */}
              {activeCallout !== i && (
                <span
                  className="absolute inset-0 rounded-full border border-primary/40 animate-ping"
                  style={{ animationDuration: `${2 + i * 0.5}s` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Caption */}
      <figcaption className="text-center text-sm text-muted-foreground mt-3 font-mono tracking-wide">
        {caption}
      </figcaption>

      {/* Annotation list */}
      <div className="mt-6 rounded-xl border border-white/8 overflow-hidden" style={{ background: "hsl(240 10% 6%)" }}>
        <div className="px-5 py-3 border-b border-white/8 flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            What you're seeing
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {callouts.map((callout, i) => (
            <motion.button
              key={i}
              data-testid={`callout-text-${i + 1}`}
              className={`
                w-full text-left flex items-start gap-4 px-5 py-4 transition-all duration-150 focus:outline-none
                ${activeCallout === i
                  ? "bg-primary/10"
                  : "hover:bg-white/4"
                }
              `}
              onClick={() => setActiveCallout(activeCallout === i ? null : i)}
              layout
            >
              <span
                className={`
                  mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                  transition-all duration-150
                  ${activeCallout === i
                    ? "bg-primary border-primary text-white"
                    : "border-white/20 text-muted-foreground bg-white/5"
                  }
                `}
              >
                {i + 1}
              </span>
              <span
                className={`text-sm leading-relaxed transition-colors duration-150 ${
                  activeCallout === i ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {callout.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </figure>
  );
}
