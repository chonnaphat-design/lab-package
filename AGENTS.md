# AGENTS.md

`lab-package` is a public, open-source React design system published to npm. Components are shadcn/ui converted to **Base UI** primitives (`@base-ui/react`, not Radix), styled with **CSS Modules** written in Tailwind v4 `@apply` over OKLCH tokens, in TypeScript. Consumers are Next.js App Router apps. They install the package, import components, and import one precompiled stylesheet.

The components were built and reviewed in the week-1-lab app and copied here. The two copies are independent, so a change in one is not reflected in the other. Test, lint and release tooling are not decided yet. Add them only when asked.

## Repo layout

An npm workspace. Run every command from the repo root.

- `packages/ui/`: the published library, npm name `lab-package`. Its `package.json`, `vite.config.ts` and `README.md` (the npm page) live here.
- `apps/storybook/`: private Storybook 10 workspace (`@lab-package/storybook`) for checking props and states. It holds config only. Stories live beside the components.
- Root `package.json`: private (`lab-package-workspace`). It holds the `workspaces` list and the `storybook` / `build-storybook` scripts.

## Commands

`package.json` scripts are the source of truth:

```bash
npm install                            # all workspaces
npm run build -w lab-package           # vite build → packages/ui/dist/
npm run typecheck -w lab-package       # tsc --noEmit (components and stories)
npm run pack:check -w lab-package      # npm pack --dry-run: the exact publish file list
npm run storybook                      # dev server, http://localhost:6006
npm run build-storybook                # static build → apps/storybook/storybook-static
npm run typecheck -w @lab-package/storybook   # .storybook/main.ts + preview.ts
```

To try the package in a real app, run `npm pack -w lab-package` and install the `.tgz` there. Avoid `npm link`: it resolves a second copy of React and breaks hooks with "Invalid hook call".

## How the build works

Paths below are relative to `packages/ui/`.

- **Vite 8 library mode** (Rolldown) with `vite-plugin-dts` produces ESM only, `.d.ts` files and source maps. Vite was chosen over tsup because it compiles CSS Modules and Tailwind `@apply` in one pass. The dts step excludes `*.stories.tsx`.
- **`preserveModules`** emits one file per source module, so each component keeps its own `"use client"`. Rolldown prints `MODULE_LEVEL_DIRECTIVE` warnings for these, which is expected.
- **All CSS goes into one `dist/styles.css`** (`cssCodeSplit: false`), exported as `lab-package/styles.css`. The import of `tokens.css` in `src/index.ts` is what puts the tokens in that file. The JS output carries no CSS import, so consumers import the stylesheet themselves.
- **Externals** come from `dependencies` + `peerDependencies` in `package.json`. A new runtime dependency is externalised automatically once it is listed there.
- Tailwind runs **only at build time**, through `postcss.config.mjs`. Utilities used via `@apply` compile with fallbacks (`var(--spacing,.25rem)`), so consumers need no Tailwind `@source` pointing at this package.

## Library layout (`packages/ui/src`)

- `components/<Name>/`: `<Name>.tsx` (markup and behavior), `<Name>.module.css` (all styles), `index.ts` (component + prop types), `<Name>.stories.tsx` (Storybook), `<Name>.md` (usage doc, see [Component docs](#component-docs)). Button also has a `README.md` with implementation notes for maintainers.
- `index.ts`: the public barrel. A component is public only after it is exported here.
- `lib/utils.ts`: `cn`, re-exported from the `cn` npm package (shadcn's clsx + tailwind-merge replacement).
- `styles/tokens.css` (**shipped**): `:root` (light) and `.dark` variables, plus the global `border-color` / `outline-color` base rule that components rely on. Keep light and dark values in sync.
- `styles/reference.css` (**not shipped**): Tailwind, `tw-animate-css`, `shadcn/tailwind.css` (the `data-open:` / `data-closed:` variants) and the `@theme inline` mapping from `--color-*` to the tokens. Every module `@reference`s it, and Storybook's preview imports it. A new token goes in both files: its value in `tokens.css`, its `--color-*` mapping in `reference.css`.

## Component docs

Before building or reviewing UI, read the `<Name>.md` doc beside each component you use, in `packages/ui/src/components/<Name>/`. Use only the props, variants and tokens listed there. If something you need is not documented, stop and ask.

When you add or change a component, write or update its `<Name>.md` in the same change, matching `Dialog.md`: Purpose (one line), When to use, When not to use, Props and variants, Tokens used, and one example taken from the stories. Write it for designers and agents building UI, so leave out exports, data attributes and CSS utilities. Mark anything unsure as TODO.

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

## Storybook

- **Stories sit beside their component:** `packages/ui/src/components/<Name>/<Name>.stories.tsx`, matched by `stories` in `apps/storybook/.storybook/main.ts`. They import the component relatively (`./Button`), so edits hot-reload without rebuilding `dist/`.
- **Tailwind runs through `@tailwindcss/vite`**, added in `main.ts` `viteFinal`. It compiles both the preview stylesheet and the components' CSS Modules.
- **`.storybook/preview.ts` imports `preview.css`**, which plays the consumer. It imports the library's `reference.css` (Tailwind reset + `--color-*` mapping, so story utilities like `text-muted-foreground` work) and `tokens.css`, `@source`s `packages/ui/src` so `className` overrides in stories get generated, and sets page colors.
- **No addons** (initialised with `--no-features`). Dark mode is checked with a story that wraps components in `<div className="dark …">`. Hover, focus-visible and active are checked by hand.
- **One `<Name>.stories.tsx` per component**, titled `Components/<Name>`, tagged `autodocs`. `Button.stories.tsx` is the model: a `Playground` with a control for every prop, then one story per prop axis (variants, sizes, icons), a `StateMatrix` (variants × prop-driven states), `Dark`, `render` usage, and a `className` override. Write stories as correct real usage, e.g. `aria-label` on `iconOnly` buttons.

## Consumer contract

`packages/ui/README.md` documents this for users. Keep the two in step.

- The consumer imports `lab-package/styles.css` once.
- The consumer provides a CSS reset (Tailwind v4 preflight), `.dark` on an ancestor for dark mode, and `--font-heading` (used by `DialogTitle` and `AlertDialogTitle`).
- `react` / `react-dom` 19 are `peerDependencies`. Next.js is never a dependency.
- Renaming or removing an export, prop, variant, `data-slot` or token is a breaking change. Call it out in your summary.

## Checks after a change

Run the library's `typecheck`, `build` and `pack:check`, plus `build-storybook` when a component or its stories changed. Then confirm against `packages/ui/dist/`:

- Each component whose source starts with `"use client"` (currently AlertDialog, Dialog, InputGroup, InputOTP) still starts with it in `dist/components/<Name>/<Name>.js`.
- `grep -r "@/" dist` returns nothing, and no `*.stories.*` file is in `dist/`.
- The pack file list contains only `dist/**`, `README.md` and `package.json`.

## Publishing

Publishing is the maintainer's call (planned for Week 4). Agents get the release ready and stop at `npm run pack:check -w lab-package`.
