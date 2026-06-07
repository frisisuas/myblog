---
title: "Building a Design Token System That Developers Will Actually Use"
subtitle: "How I went from 200 inconsistent color values to one source of truth — and got the whole team to buy in."
date: "May 14, 2025"
readTime: "8 min read"
tags:
  - "Design Systems"
  - "CSS"
  - "Tokens"
coverImage: "/images/orbit.png"
---

When I joined the Orbit project, our design system had a problem that's embarrassingly common: every team was inventing its own shades of gray. We had 47 different values for what was conceptually the same 'border' color. The codebase was a graveyard of one-off overrides.

The solution wasn't a better Figma file. It was a shared vocabulary — a token system that both designers and engineers spoke fluently. Here's exactly how we built it.

## Start with primitives, not semantics

The first mistake most teams make is jumping straight to semantic tokens like 'button-background'. You need a foundation layer first — raw, named values with no opinion about where they're used. We called these primitives.

```css:tokens/primitives.css
/* Primitive layer — named values, no semantics */
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
}
```

Once primitives are locked, you build a semantic layer on top. This is where meaning lives. 'surface-default' maps to a primitive and can be remapped for dark mode without touching any component code.

```css:tokens/semantic.css
/* Semantic layer — meaning, not values */
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
}
```

## The Figma side of the equation

![Orbit Design System component library overview](/images/orbit.png "Fig. 1 — The Orbit component library in Figma, showing how token variables surface in the inspector panel")

Notice how the variable names in Figma exactly match the CSS variable names. This wasn't a coincidence — it was the most important decision we made. When a developer reads 'var(--color-action-primary)' and a designer reads '/color/action/primary', they know they're looking at the same thing.

## Automating the sync with Style Dictionary

Hand-syncing tokens between Figma and code is a trap. It breaks on the second update. We used Style Dictionary to generate tokens from a single JSON source of truth that fed both the CSS variables and the Figma variables plugin.

```typescript:style-dictionary.config.ts
import StyleDictionary from 'style-dictionary';

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
console.log('Tokens built successfully');
```

> The token system isn't a design artifact or an engineering artifact. It's a contract between both disciplines. The moment you treat it as one team's responsibility, it becomes the other team's problem.
> — Alex Chen

Six months in, the results spoke for themselves: design-to-development handoff went from multi-hour calls to async Figma comments. Engineers stopped asking 'what shade of gray is this?' because the answer was always a variable name. That's the real win — not the tokens themselves, but the shared language they created.
