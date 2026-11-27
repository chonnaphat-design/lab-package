# lab-package

React design system components (built in the week-1-lab app): shadcn/ui converted to Base UI primitives, styled with CSS Modules over OKLCH design tokens.

Components: `Accordion` (+ parts), `AlertDialog` (+ parts), `Attachment` (+ parts), `Avatar` (+ parts), `Badge`, `Button`, `Card` (+ parts), `Chart` (+ parts), `Checkbox`, `Dialog` (+ parts), `Input`, `InputGroup` (+ parts), `InputOTP` (+ parts), `Table` (+ parts), `Textarea`.

## Use

```bash
npm install lab-package
```

Peer dependencies: `react` and `react-dom` 19. To use `Chart`, also install `recharts` 3 (`npm install recharts`): you build charts from its parts, and the app must have exactly one copy. The data-table recipe in the `Table` docs (sorting, filtering, selection, pagination) uses `@tanstack/react-table` 8, which you install in your app; the package itself does not depend on it.

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
- **`--font-heading`** on an ancestor. `DialogTitle`, `AlertDialogTitle` and `CardTitle` use it. Other text inherits the app's font.

**Overrides:** a Tailwind utility passed through `className` beats the component's own styles without `!important`, because utilities live in a later layer. To retheme, redefine a token on `:root` / `.dark` after importing the stylesheet.

### Server components

`AlertDialog`, `Attachment`, `Avatar`, `Chart`, `Checkbox`, `Dialog`, `InputGroup`, `InputOTP` and `Table` ship with `"use client"`. `Accordion`, `Badge`, `Button`, `Card`, `Input` and `Textarea` have no directive, matching their source.

## Develop

From the repo root (an npm workspace):

```bash
npm install
npm run build -w lab-package       # vite build → packages/ui/dist/ (ESM, .d.ts, styles.css)
npm run typecheck -w lab-package   # tsc --noEmit
npm run pack:check -w lab-package  # npm pack --dry-run: lists exactly what would publish
npm run storybook                  # component props and states, http://localhost:6006
```

How the build works and the rules for changing components are in [AGENTS.md](https://github.com/chonnaphat-design/lab-package/blob/main/AGENTS.md).
