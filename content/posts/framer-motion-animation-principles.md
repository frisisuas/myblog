---
title: "The 4 Animation Principles I Apply to Every UI"
subtitle: "Good motion design isn't about adding animations — it's about communicating state, hierarchy, and causality."
date: "April 3, 2025"
readTime: "6 min read"
tags:
  - "Animation"
  - "Framer Motion"
  - "React"
coverImage: "/images/wander.png"
---

Most UI animations feel gratuitous because they decorate rather than communicate. A spinning loader tells you something is happening. A skeleton screen tells you where content will appear. The first is noise; the second is signal. The difference is intent.

Over five years and dozens of shipped products, I've narrowed my animation toolkit to four principles. Everything else is just implementation detail.

## 1. Duration follows complexity

Simple state changes (button hover, toggle) should resolve in 100–200ms. A full-screen transition earns 300–500ms. Nothing functional should ever take more than 600ms — anything slower teaches users to wait instead of explore.

```typescript:animations/durations.ts
// Shared animation constants — import these everywhere
export const DURATION = {
  instant:    0.1,   // Micro-interactions: icon morphs, checkbox ticks
  fast:       0.2,   // Hover states, small element transitions
  standard:   0.35,  // Most UI transitions: modals open, drawers slide
  deliberate: 0.5,   // Page-level transitions, large layout shifts
  slow:       0.7,   // Hero entrances, onboarding sequences
} as const;

export const EASE = {
  // Natural deceleration — for things entering the screen
  out: [0.16, 1, 0.3, 1],
  // Natural acceleration — for things leaving the screen
  in:  [0.7, 0, 0.84, 0],
  // Sharp peak — for elastic/spring-like feel
  inOut: [0.87, 0, 0.13, 1],
  // Linear — reserved for loaders only
  linear: 'linear',
} as const;
```

## 2. Enter fast, exit faster

Elements entering the screen should ease out — they start fast and settle gently. Elements leaving should ease in — they start slow and accelerate away. This matches how attention works: you want to see what arrived, not watch what left.

```tsx:components/Modal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { DURATION, EASE } from '@/animations/durations';

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: DURATION.fast,
      ease: EASE.in,   // Accelerates out — exits quickly
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION.standard,
      ease: EASE.out,  // Decelerates in — settles naturally
    },
  },
};

export function Modal({ isOpen, children }: ModalProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="modal-panel"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## 3. Stagger creates hierarchy

When multiple elements enter at once, staggering them communicates which is primary. The first element is most important. Use 40–80ms between items — enough to read as sequential, not enough to feel slow.

![Wander travel app showing staggered card entrance animation](/images/wander.png "Fig. 2 — Staggered entrance in the Wander destination feed. Each card enters 60ms after the previous.")

```tsx:components/DestinationFeed.tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,  // 60ms between each child
      delayChildren: 0.1,     // Brief pause before stagger starts
    },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: EASE.out },
  },
};

export function DestinationFeed({ destinations }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {destinations.map((d) => (
        <motion.li key={d.id} variants={itemVariants}>
          <DestinationCard destination={d} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

## 4. Continuity over surprise

The best transition is one that feels inevitable in hindsight. Use layout animations to let elements morph between states rather than cutting or fading. Framer Motion's layout prop does most of the heavy lifting here.

```tsx:components/ExpandableCard.tsx
// The layout prop tells Framer Motion to animate any size/position change
// automatically. No keyframes needed — just change the DOM structure.
export function ExpandableCard({ item, isExpanded, onToggle }) {
  return (
    <motion.div
      layout                    // Animates width, height, position automatically
      onClick={onToggle}
      className={cn(
        "card",
        isExpanded ? "card--expanded" : "card--collapsed"
      )}
    >
      <motion.h3 layout="position">   {/* Only animates position, not size */}
        {item.title}
      </motion.h3>

      <AnimatePresence>
        {isExpanded && (
          <motion.p
            key="body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            {item.description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

> Animation is the UI's body language. Done right, users never consciously notice it — they just feel that the app understands them.
> — Alex Chen
