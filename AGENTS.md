# AGENTS.md

`lab-package` is a public, open-source React design system published to npm. Components are shadcn/ui converted to **Base UI** primitives (`@base-ui/react`, not Radix), styled with **CSS Modules** written in Tailwind v4 `@apply` over OKLCH tokens, in TypeScript. Consumers are Next.js App Router apps. They install the package, import components, and import one precompiled stylesheet.

The components were built and reviewed in the week-1-lab app and copied here. The two copies are independent, so a change in one is not reflected in the other. Test, lint and release tooling are not decided yet. Add them only when asked.

## Commands

`package.json` scripts are the source of truth:

```bash
npm install
npm run build        # vite build → dist/
npm run typecheck    # tsc --noEmit
npm run pack:check   # npm pack --dry-run: the exact publish file list
```

To try the package in a real app, run `npm pack` and install the `.tgz` there. Avoid `npm link`: it resolves a second copy of React and breaks hooks with "Invalid hook call".

## How the build works

- **Vite 8 library mode** (Rolldown) with `vite-plugin-dts` produces ESM only, `.d.ts` files and source maps. Vite was chosen over tsup because it compiles CSS Modules and Tailwind `@apply` in one pass.
- **`preserveModules`** emits one file per source module, so each component keeps its own `"use client"`. Rolldown prints `MODULE_LEVEL_DIRECTIVE` warnings for these, which is expected.
- **All CSS goes into one `dist/styles.css`** (`cssCodeSplit: false`), exported as `lab-package/styles.css`. The import of `tokens.css` in `src/index.ts` is what puts the tokens in that file. The JS output carries no CSS import, so consumers import the stylesheet themselves.
- **Externals** come from `dependencies` + `peerDependencies` in `package.json`. A new runtime dependency is externalised automatically once it is listed there.
- Tailwind runs **only at build time**. Utilities used via `@apply` compile with fallbacks (`var(--spacing,.25rem)`), so consumers need no Tailwind `@source` pointing at this package.

## Layout

- `src/components/<Name>/`: `<Name>.tsx` (markup and behavior), `<Name>.module.css` (all styles), `index.ts` (component + prop types). Button also has a `README.md`, which is the model component doc.
- `src/index.ts`: the public barrel. A component is public only after it is exported here.
- `src/lib/utils.ts`: `cn`, re-exported from the `cn` npm package (shadcn's clsx + tailwind-merge replacement).
- `src/styles/tokens.css` (**shipped**): `:root` (light) and `.dark` variables, plus the global `border-color` / `outline-color` base rule that components rely on. Keep light and dark values in sync.
- `src/styles/reference.css` (**build-only**): Tailwind, `tw-animate-css`, `shadcn/tailwind.css` (the `data-open:` / `data-closed:` variants) and the `@theme inline` mapping from `--color-*` to the tokens. Every module `@reference`s it, and it emits nothing. A new token goes in both files: its value in `tokens.css`, its `--color-*` mapping in `reference.css`.

## Component anatomy

- **TSX has no style classes and no `cva`.** It sets `className={cn(styles.root, className)}` and exposes variants as `data-variant` / `data-size` / boolean `data-*` attributes. Keep shadcn's `data-slot` attributes, because other components' CSS targets them.
- **Composition uses Base UI's `render` prop / `useRender` + `mergeProps`** (see `Badge.tsx`). Check the Base UI API rather than assuming Radix props like `asChild`.
- **Semantic prop vocabulary:** `variant` = `primary | secondary | outline | ghost | danger | link` (default `primary`); `size` = `xs | sm | md | lg` (default `md`) plus `iconOnly`; `invalid` on form controls. New components use the same words.
- **Every module starts with this header, and every rule sits in `@layer components`:**

  ```css
  @reference "../../styles/reference.css";
  @layer theme, base, components, utilities;
  @layer components { /* rules */ }
  ```

  The header is what lets a consumer's Tailwind utility passed via `className` win without `!important`.
- Variants are attribute selectors, e.g. `.root[data-variant="primary"] { @apply … }`. Normal Tailwind variants (`hover:`, `focus-visible:`, `aria-invalid:`, `has-[…]:`, `data-open:`, `sm:`) work inside `@apply`.

### CSS Modules pitfalls (class names are renamed)

- **Dark mode:** write a separate `:global(.dark) .root[…] { @apply …; }` rule, because `dark:` inside `@apply` targets a renamed `.dark`.
- **Group selectors:** use a descendant selector on the parent's class (`.root[data-disabled="true"] .addon`) instead of `group/name` + `group-*`.
- **Utility classes in selectors:** reference them as `:global(.border-b)`.
- **Containers:** use an unnamed `@container`. CSS custom properties are not renamed.
- **Restyling an embedded component** (InputGroup → Button/Input): scope under the parent (`.root .button[data-slot="button"]`) or key the state on `data-slot` in the child's own module, so the result does not depend on CSS load order.

## Consumer contract

The README documents this for users. Keep the two in step.

- The consumer imports `lab-package/styles.css` once.
- The consumer provides a CSS reset (Tailwind v4 preflight), `.dark` on an ancestor for dark mode, and `--font-heading` (used by `DialogTitle`).
- `react` / `react-dom` 19 are `peerDependencies`. Next.js is never a dependency.
- Renaming or removing an export, prop, variant, `data-slot` or token is a breaking change. Call it out in your summary.

## Checks after a change

Run `typecheck`, `build`, then `pack:check`. Then confirm against `dist/`:

- Each component whose source starts with `"use client"` (currently Dialog, InputGroup, InputOTP) still starts with it in `dist/components/<Name>/<Name>.js`.
- `grep -r "@/" dist` returns nothing.
- The pack file list contains only `dist/**`, `README.md` and `package.json`.

## Publishing

Publishing is the maintainer's call (planned for Week 4). Agents get the release ready and stop at `npm run pack:check`.
