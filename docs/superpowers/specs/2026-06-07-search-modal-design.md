# Search Modal — Design Spec
**Date:** 2026-06-07  
**Status:** Approved

## Overview

Global fuzzy search modal accessible from any page via `Ctrl+K` / `Cmd+K` or a navbar icon. Searches across blog post titles, subtitles, and tags using Fuse.js. Animated with Framer Motion.

## Architecture

| Action | File |
|--------|------|
| Create | `src/components/SearchModal.tsx` |
| Create | `src/hooks/use-search.ts` |
| Modify | `src/components/navbar.tsx` |
| Modify | `src/App.tsx` |

### Component responsibilities

**`use-search.ts`**  
Custom hook. Accepts a string query and returns a filtered array of `BlogPost`. Wraps a memoized Fuse instance so it is not rebuilt on every keystroke. Exported interface: `useSearch(query: string): BlogPost[]`.

**`SearchModal.tsx`**  
Renders the backdrop + modal panel. Receives `isOpen`, `onClose` props from `App.tsx`. Contains the text input, results list, keyboard navigation logic, and empty state. Uses `AnimatePresence` + `motion.div` for open/close animation.

**`navbar.tsx`**  
Adds a search icon button (Lucide `Search`) to the right side of the nav. Emits `onSearchOpen` callback. Registers a `keydown` listener for `Ctrl+K` / `Cmd+K`.

**`App.tsx`**  
Renders `<SearchModal>` at the root level alongside `<Router>` so it overlays any page. Holds `isSearchOpen` state and passes open/close handlers down.

## Behavior

| Trigger | Action |
|---------|--------|
| `Ctrl+K` / `Cmd+K` | Opens modal from any page |
| Click 🔍 icon in navbar | Opens modal |
| `Escape` | Closes modal |
| Click backdrop | Closes modal |
| `↑` / `↓` | Navigates between results |
| `Enter` | Navigates to selected post (wouter) |
| Click result | Navigates to post, closes modal |

- Input auto-focuses on open.
- Query empty → shows all posts (up to 6, most recent first).
- Query non-empty → shows Fuse.js results, max 6.
- No results → shows `"No hay artículos que coincidan con '[query]'"`.
- Each result row: thumbnail image (via `imageUrl()` from `src/lib/utils.ts`), title, truncated subtitle, tag chips.

## Animation

Using Framer Motion `AnimatePresence`:

```
Backdrop: opacity 0 → 1 (200ms ease-out) / reverse on close
Modal panel: opacity 0 + y -16 → opacity 1 + y 0 (250ms ease-out) / reverse on close
```

## Search Logic

**Library:** `fuse.js`

**Fuse configuration:**
```ts
{
  threshold: 0.4,
  keys: [
    { name: 'title',    weight: 0.5 },
    { name: 'subtitle', weight: 0.3 },
    { name: 'tags',     weight: 0.2 },
  ],
}
```

- Fuse instance is created once via `useMemo` over `BLOG_POSTS`.
- When `query` is empty, return all posts sorted by date (existing array order).
- Results are sliced to a maximum of 6 items before rendering.

## Error Handling

- No network calls — all data is in-memory. No loading or error states needed.
- Image load errors on result thumbnails fall back gracefully via `onError` → hide `<img>`.

## Testing

- Verify `Ctrl+K` opens modal on portfolio page and blog page.
- Verify `Escape` and backdrop click close the modal.
- Verify arrow key navigation cycles through results.
- Verify `Enter` navigates to the correct post URL.
- Verify query `"desing"` returns the design token post (fuzzy match).
- Verify empty query shows all posts.
- Verify a query with no matches shows the empty state message.
