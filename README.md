# lab-package

React design system components (built in the week-1-lab app): shadcn/ui converted to Base UI primitives, styled with CSS Modules over OKLCH design tokens.

Components: `Badge`, `Button`, `Dialog` (+ parts), `Input`, `InputGroup` (+ parts), `InputOTP` (+ parts), `Textarea`.

## Use

```bash
npm install lab-package
```

Peer dependencies: `react` and `react-dom` 19.

Import the stylesheet once, at the root of the app (in Next.js, `app/layout.tsx`), then import components:

```tsx
import "lab-package/styles.css"

import { Button } from "lab-package"

<Button variant="outline" size="sm">Cancel</Button>
```

### The stylesheet: `lab-package/styles.css`

One precompiled file, so the consuming app does not need to scan this package with Tailwind. It contains:

- **Tokens:** every color, `--radius` and chart/sidebar variable on `:root` (light) and `.dark` (dark). Source: [`src/styles/tokens.css`](src/styles/tokens.css).
- **Base rule:** `* { border-color: var(--border); outline-color: ring/50 }` in `@layer base`. Components rely on it.
- **Component styles:** the CSS Modules, compiled. Every rule sits in `@layer components`, and the file declares `@layer theme, base, components, utilities`.

What the app must provide:

- **A CSS reset.** Components assume Tailwind v4's preflight (`@import "tailwindcss"`), as in the original app.
- **`.dark` on an ancestor** for dark mode (e.g. `next-themes` with `attribute="class"`).
- **`--font-heading`** on an ancestor. `DialogTitle` uses it. Other text inherits the app's font.

**Overrides:** a Tailwind utility passed through `className` beats the component's own styles without `!important`, because utilities live in a later layer. To retheme, redefine a token on `:root` / `.dark` after importing the stylesheet.

### Server components

`Dialog`, `InputGroup` and `InputOTP` ship with `"use client"`. `Badge`, `Button`, `Input` and `Textarea` have no directive, matching their source.

## Develop

```bash
npm install
npm run build       # vite build → dist/ (ESM, .d.ts, styles.css)
npm run typecheck   # tsc --noEmit
npm run pack:check  # npm pack --dry-run: lists exactly what would publish
```

How the build works and the rules for changing components are in [AGENTS.md](AGENTS.md).
