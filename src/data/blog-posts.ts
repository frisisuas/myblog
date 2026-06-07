export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "code"; language: string; filename?: string; code: string }
  | { type: "annotated-image"; src: string; alt: string; caption: string; callouts: { x: number; y: number; label: string }[] }
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
  content: ContentBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-a-design-token-system",
    title: "Building a Design Token System That Developers Will Actually Use",
    subtitle: "How I went from 200 inconsistent color values to one source of truth — and got the whole team to buy in.",
    date: "May 14, 2025",
    readTime: "8 min read",
    tags: ["Design Systems", "CSS", "Tokens"],
    coverImage: "/images/orbit.png",
    content: [
      {
        type: "paragraph",
        text: "When I joined the Orbit project, our design system had a problem that's embarrassingly common: every team was inventing its own shades of gray. We had 47 different values for what was conceptually the same 'border' color. The codebase was a graveyard of one-off overrides.",
      },
      {
        type: "paragraph",
        text: "The solution wasn't a better Figma file. It was a shared vocabulary — a token system that both designers and engineers spoke fluently. Here's exactly how we built it.",
      },
      {
        type: "heading",
        text: "Start with primitives, not semantics",
      },
      {
        type: "paragraph",
        text: "The first mistake most teams make is jumping straight to semantic tokens like 'button-background'. You need a foundation layer first — raw, named values with no opinion about where they're used. We called these primitives.",
      },
      {
        type: "code",
        language: "css",
        filename: "tokens/primitives.css",
        code: `/* Primitive layer — named values, no semantics */
:root {
  /* Brand scale */
  --color-orange-50:  #fff7ed;
  --color-orange-100: #ffedd5;
  --color-orange-400: #fb923c;
  --color-orange-500: #f97316;  /* Brand primary */
  --color-orange-600: #ea580c;

  /* Neutral scale */
  --color-gray-50:  #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-800: #27272a;
  --color-gray-900: #18181b;
  --color-gray-950: #09090b;

  /* Feedback */
  --color-green-500: #22c55e;
  --color-red-500:   #ef4444;
  --color-yellow-400:#facc15;
}`,
      },
      {
        type: "paragraph",
        text: "Once primitives are locked, you build a semantic layer on top. This is where meaning lives. 'surface-default' maps to a primitive and can be remapped for dark mode without touching any component code.",
      },
      {
        type: "code",
        language: "css",
        filename: "tokens/semantic.css",
        code: `/* Semantic layer — meaning, not values */
:root {
  --color-surface-default:   var(--color-gray-50);
  --color-surface-elevated:  #ffffff;
  --color-surface-sunken:    var(--color-gray-100);

  --color-text-primary:      var(--color-gray-900);
  --color-text-secondary:    var(--color-gray-600);
  --color-text-disabled:     var(--color-gray-400);

  --color-border-default:    var(--color-gray-200);
  --color-border-strong:     var(--color-gray-400);

  --color-action-primary:    var(--color-orange-500);
  --color-action-primary-hover: var(--color-orange-600);
}

.dark {
  --color-surface-default:   var(--color-gray-950);
  --color-surface-elevated:  var(--color-gray-900);
  --color-surface-sunken:    var(--color-gray-800);

  --color-text-primary:      var(--color-gray-50);
  --color-text-secondary:    var(--color-gray-400);
  --color-border-default:    var(--color-gray-800);
}`,
      },
      {
        type: "heading",
        text: "The Figma side of the equation",
      },
      {
        type: "annotated-image",
        src: "/images/orbit.png",
        alt: "Orbit Design System component library overview",
        caption: "Fig. 1 — The Orbit component library in Figma, showing how token variables surface in the inspector panel",
        callouts: [
          { x: 18, y: 22, label: "Variable groups mirror the CSS layer structure — primitives and semantics are separate libraries" },
          { x: 72, y: 45, label: "The inspector panel shows token names, not raw hex values — a designer can read 'color/action/primary' without ever opening the token file" },
          { x: 45, y: 75, label: "Component variants are built using semantic tokens only. No primitive is ever applied directly to a component" },
        ],
      },
      {
        type: "paragraph",
        text: "Notice how the variable names in Figma exactly match the CSS variable names. This wasn't a coincidence — it was the most important decision we made. When a developer reads 'var(--color-action-primary)' and a designer reads '/color/action/primary', they know they're looking at the same thing.",
      },
      {
        type: "heading",
        text: "Automating the sync with Style Dictionary",
      },
      {
        type: "paragraph",
        text: "Hand-syncing tokens between Figma and code is a trap. It breaks on the second update. We used Style Dictionary to generate tokens from a single JSON source of truth that fed both the CSS variables and the Figma variables plugin.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "style-dictionary.config.ts",
        code: `import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'color',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'primitives.css',
          format: 'css/variables',
          filter: (token) => token.attributes?.category === 'primitive',
        },
        {
          destination: 'semantic.css',
          format: 'css/variables',
          filter: (token) => token.attributes?.category === 'semantic',
        },
      ],
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/figma/',
      files: [{ destination: 'tokens.json', format: 'json/nested' }],
    },
  },
});

await sd.buildAllPlatforms();
console.log('Tokens built successfully');`,
      },
      {
        type: "quote",
        text: "The token system isn't a design artifact or an engineering artifact. It's a contract between both disciplines. The moment you treat it as one team's responsibility, it becomes the other team's problem.",
        author: "Alex Chen",
      },
      {
        type: "paragraph",
        text: "Six months in, the results spoke for themselves: design-to-development handoff went from multi-hour calls to async Figma comments. Engineers stopped asking 'what shade of gray is this?' because the answer was always a variable name. That's the real win — not the tokens themselves, but the shared language they created.",
      },
    ],
  },
  {
    slug: "framer-motion-animation-principles",
    title: "The 4 Animation Principles I Apply to Every UI",
    subtitle: "Good motion design isn't about adding animations — it's about communicating state, hierarchy, and causality.",
    date: "April 3, 2025",
    readTime: "6 min read",
    tags: ["Animation", "Framer Motion", "React"],
    coverImage: "/images/wander.png",
    content: [
      {
        type: "paragraph",
        text: "Most UI animations feel gratuitous because they decorate rather than communicate. A spinning loader tells you something is happening. A skeleton screen tells you where content will appear. The first is noise; the second is signal. The difference is intent.",
      },
      {
        type: "paragraph",
        text: "Over five years and dozens of shipped products, I've narrowed my animation toolkit to four principles. Everything else is just implementation detail.",
      },
      {
        type: "heading",
        text: "1. Duration follows complexity",
      },
      {
        type: "paragraph",
        text: "Simple state changes (button hover, toggle) should resolve in 100–200ms. A full-screen transition earns 300–500ms. Nothing functional should ever take more than 600ms — anything slower teaches users to wait instead of explore.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "animations/durations.ts",
        code: `// Shared animation constants — import these everywhere
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
} as const;`,
      },
      {
        type: "heading",
        text: "2. Enter fast, exit faster",
      },
      {
        type: "paragraph",
        text: "Elements entering the screen should ease out — they start fast and settle gently. Elements leaving should ease in — they start slow and accelerate away. This matches how attention works: you want to see what arrived, not watch what left.",
      },
      {
        type: "code",
        language: "tsx",
        filename: "components/Modal.tsx",
        code: `import { motion, AnimatePresence } from 'framer-motion';
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
}`,
      },
      {
        type: "heading",
        text: "3. Stagger creates hierarchy",
      },
      {
        type: "paragraph",
        text: "When multiple elements enter at once, staggering them communicates which is primary. The first element is most important. Use 40–80ms between items — enough to read as sequential, not enough to feel slow.",
      },
      {
        type: "annotated-image",
        src: "/images/wander.png",
        alt: "Wander travel app showing staggered card entrance animation",
        caption: "Fig. 2 — Staggered entrance in the Wander destination feed. Each card enters 60ms after the previous.",
        callouts: [
          { x: 22, y: 30, label: "The header text always leads — it establishes context before any cards appear" },
          { x: 55, y: 55, label: "Cards stagger top-to-bottom, matching natural reading order. The eye is already moving downward" },
          { x: 80, y: 78, label: "The last card enters with the same velocity as the first — duration is fixed, only delay changes" },
        ],
      },
      {
        type: "code",
        language: "tsx",
        filename: "components/DestinationFeed.tsx",
        code: `const containerVariants = {
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
}`,
      },
      {
        type: "heading",
        text: "4. Continuity over surprise",
      },
      {
        type: "paragraph",
        text: "The best transition is one that feels inevitable in hindsight. Use layout animations to let elements morph between states rather than cutting or fading. Framer Motion's layout prop does most of the heavy lifting here.",
      },
      {
        type: "code",
        language: "tsx",
        filename: "components/ExpandableCard.tsx",
        code: `// The layout prop tells Framer Motion to animate any size/position change
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
}`,
      },
      {
        type: "quote",
        text: "Animation is the UI's body language. Done right, users never consciously notice it — they just feel that the app understands them.",
        author: "Alex Chen",
      },
    ],
  },
  {
    slug: "redesigning-finflow-onboarding",
    title: "Why I Redesigned the Finflow Onboarding Flow Twice",
    subtitle: "A candid postmortem on what user research revealed, what we got wrong the first time, and why the second version worked.",
    date: "February 18, 2025",
    readTime: "10 min read",
    tags: ["UX Research", "Case Study", "Onboarding"],
    coverImage: "/images/finflow.png",
    content: [
      {
        type: "paragraph",
        text: "The first version of Finflow's onboarding took 11 steps and a 3-minute average completion time. We were proud of it. We had tooltips, a progress bar, confetti on completion. It was comprehensive. It was also, as our data eventually showed, quietly killing activation.",
      },
      {
        type: "heading",
        text: "What the numbers were telling us",
      },
      {
        type: "paragraph",
        text: "Three weeks after launch, our activation rate — the percentage of signups who connected a bank account within 24 hours — sat at 23%. Industry benchmarks for fintech apps hover around 40%. We had a problem.",
      },
      {
        type: "annotated-image",
        src: "/images/finflow.png",
        alt: "Finflow original onboarding flow with drop-off funnel",
        caption: "Fig. 3 — The original 11-step onboarding. Drop-off concentrated at two points: bank connection and permissions.",
        callouts: [
          { x: 20, y: 35, label: "Steps 1–4 collected information we already had from signup. Users felt like they were repeating themselves" },
          { x: 60, y: 48, label: "The bank connection screen was step 7 of 11. Users hit the hardest ask after already investing 90 seconds — but they were also most fatigued here" },
          { x: 75, y: 72, label: "Notification permissions appeared immediately after bank connection. Two high-friction asks back-to-back caused a sharp drop" },
        ],
      },
      {
        type: "paragraph",
        text: "Session recordings were where the real story lived. Users weren't leaving because the flow was broken — they were leaving because they were exhausted. We'd front-loaded all the trust asks before delivering any value. It was like asking someone to sign a contract before you'd even introduced yourself.",
      },
      {
        type: "heading",
        text: "The research sprint",
      },
      {
        type: "paragraph",
        text: "We ran 8 moderated usability sessions over two weeks with participants who'd never seen the app. The pattern was immediate: users wanted to see what the app could do before they committed their bank credentials. They needed to feel safe before they'd feel ready.",
      },
      {
        type: "quote",
        text: "I don't mind connecting my bank. I just want to know what I'm connecting it to first.",
        author: "Research participant, Session 4",
      },
      {
        type: "heading",
        text: "Version 2: Value before ask",
      },
      {
        type: "paragraph",
        text: "The redesign followed a single organizing principle: show the destination before asking for the journey. We created a demo mode — a fully functional version of the app populated with anonymized sample data — that users could explore for 60 seconds before seeing a single form field.",
      },
      {
        type: "annotated-image",
        src: "/images/pulse.png",
        alt: "Finflow v2 onboarding with demo mode and progressive disclosure",
        caption: "Fig. 4 — Version 2. The demo mode lets users experience the product before committing. Bank connection moved to step 3.",
        callouts: [
          { x: 15, y: 28, label: "The demo banner is always visible — users know they're in a safe, consequence-free environment. This reduces anxiety significantly" },
          { x: 50, y: 42, label: "'Safe to Spend' is the hero metric — users immediately understand the core value proposition before any data is required" },
          { x: 82, y: 65, label: "The 'Connect your bank' CTA only appears after the user has spent meaningful time in the demo. They're asking to connect, not being asked" },
        ],
      },
      {
        type: "paragraph",
        text: "We also collapsed 11 steps into 4 by eliminating every question we could answer without user input, and deferring notifications permission to 72 hours post-activation when engagement data showed users were most receptive.",
      },
      {
        type: "code",
        language: "typescript",
        filename: "onboarding/flow-config.ts",
        code: `// V2 onboarding — 4 steps, value-first ordering
export const ONBOARDING_STEPS = [
  {
    id: 'demo',
    component: DemoExplorer,
    // No form fields. User explores the app with sample data.
    // CTA: "This is your data — let's make it real"
    requiredFields: [],
    canSkip: false,
  },
  {
    id: 'intent',
    component: GoalSelection,
    // Single question: what do you want to accomplish?
    // Personalizes the empty state they'll see after connection
    requiredFields: ['primaryGoal'],
    canSkip: true,
  },
  {
    id: 'connect',
    component: BankConnection,
    // The heavy ask — but now it's step 3, not step 7
    // User already has context for WHY they're connecting
    requiredFields: ['bankAccount'],
    canSkip: false,
  },
  {
    id: 'celebrate',
    component: ActivationSuccess,
    // Show personalized first insight immediately
    // No permissions ask here — deferred to 72h lifecycle email
    requiredFields: [],
    canSkip: false,
  },
] satisfies OnboardingStep[];`,
      },
      {
        type: "heading",
        text: "The outcome",
      },
      {
        type: "paragraph",
        text: "After a two-week A/B test with 50/50 traffic, v2 showed a 68% activation rate against v1's 23%. More importantly, 7-day retention — users returning after their first session — went from 31% to 54%. Users who experienced the demo weren't just more likely to connect their bank. They were more likely to come back.",
      },
      {
        type: "paragraph",
        text: "The lesson wasn't that our original onboarding was poorly designed. It was that it was designed around our goals — collect data, enable features — rather than the user's goal: understand if this product is worth trusting. Once we aligned those two things, the metrics followed almost automatically.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
