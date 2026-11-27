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

- `components/<Name>/`: `<Name>.tsx` (markup and behavior), `<Name>.module.css` (all styles), `index.ts` (component + prop types), `<Name>.stories.tsx` (Storybook), `<Name>.md` (usage doc, see [Component docs](#component-docs)), `<Name>.mdx` (the same doc in Thai, shown in Storybook). Button also has a `README.md` with implementation notes for maintainers.
- `index.ts`: the public barrel. A component is public only after it is exported here.
- `lib/utils.ts`: `cn`, re-exported from the `cn` npm package (shadcn's clsx + tailwind-merge replacement).
- `styles/tokens.css` (**shipped**): `:root` (light) and `.dark` variables, plus the global `border-color` / `outline-color` base rule that components rely on. Keep light and dark values in sync.
- `styles/reference.css` (**not shipped**): Tailwind, `tw-animate-css`, `shadcn/tailwind.css` (the `data-open:` / `data-closed:` variants) and the `@theme inline` mapping from `--color-*` to the tokens. Every module `@reference`s it, and Storybook's preview imports it. A new token goes in both files: its value in `tokens.css`, its `--color-*` mapping in `reference.css`.

## Component docs

Before building or reviewing UI, read the `<Name>.md` doc beside each component you use, in `packages/ui/src/components/<Name>/`. For example, any UI with a button means reading `packages/ui/src/components/Button/Button.md` first. Use only the props, variants and tokens listed there. If something you need is not documented, stop and ask.

When you add or change a component, write or update its `<Name>.md` in the same change, matching `Dialog.md`: Purpose (one line), When to use, When not to use, Import and use, Props and variants, Tokens used, and one example taken from the stories. Write it for designers and agents building UI, so leave out data attributes and CSS utilities. **Import and use** shows the package install, the one-time `lab-package/styles.css` import, the import line with every public part of the component, a minimal snippet, and whether the file needs `"use client"` in Next.js. Mark anything unsure as TODO.

### Keep the Storybook page in step

The English `<Name>.md` is the source of truth. `<Name>.mdx` beside it is the same doc in Thai, shown in Storybook as the component's **คู่มือการใช้งาน** page. `packages/ui/src/Introduction.mdx` is the Thai landing page.

- **Whenever a `<Name>.md` changes, update its `<Name>.mdx` in the same change**, section for section: the same facts, numbers, props, TODOs and code. Code blocks stay identical; only the prose is Thai.
- A new component gets both files, and its `.mdx` attaches to the stories with `<Meta of={…Stories} name="คู่มือการใช้งาน" />` and shows its example with `<Canvas of={…} />`.
- A change to the consumer contract (install, stylesheet, `--font-heading`, `.dark`) or to the token list also updates `Introduction.mdx`.
- Never leave a `.md` change without its `.mdx` counterpart. If you can't translate it, stop and ask.

## Adding a component

Components come from shadcn's **`base-maia`** style (Base UI, `olive` base colour), the style the week-1-lab app was set up with. Get the source from `https://ui.shadcn.com/r/styles/base-maia/<name>.json`. Its `files[].content` is the TSX with Tailwind classes inline and icons as `IconPlaceholder` (use the `lucide` name).

Then, in one change:

1. **Convert** it to `packages/ui/src/components/<Name>/`: `<Name>.tsx` with no style classes, every class moved into `<Name>.module.css` (see [Component anatomy](#component-anatomy)), and `index.ts` exporting the parts. Keep shadcn's `data-slot` names. Add `"use client"` only if the source has it or the TSX uses hooks.
2. **Check it against the Base UI API** (`node_modules/@base-ui/react/<name>/`) rather than trusting shadcn's classes; fix anything that doesn't work with Base UI, and say what you changed and why in a CSS comment.
3. **Give it the shared focus ring** (`focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`) on anything focusable, if shadcn left it out.
4. **Export it** from `src/index.ts` (alphabetical), and add it to `packages/ui/README.md` (component list and the `"use client"` sentence) and to the component table in `packages/ui/src/Introduction.mdx`.
5. **Stories**: `<Name>.stories.tsx` following the Storybook rules below.
6. **Docs**: `<Name>.md` and its Thai `<Name>.mdx`, per [Component docs](#component-docs).
7. **If it ships `"use client"`**, add it to the list in [Checks after a change](#checks-after-a-change).
8. **Verify** in Storybook: keyboard (Tab, Enter/Space), focus ring, states, dark mode, and axe; then run the checks.

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
- **Height animations (Accordion, Collapsible):** `tw-animate-css`'s `animate-accordion-*` / `animate-collapsible-*` keyframes read Radix's height variables, so with Base UI they jump instead of animating. Transition `height` from Base UI's `--accordion-panel-height` (or `--collapsible-panel-height`) and set `h-0` on `[data-starting-style]` / `[data-ending-style]`, as `Accordion.module.css` does.
- **Restyling an embedded component** (InputGroup → Button/Input): scope under the parent (`.root .button[data-slot="button"]`) or key the state on `data-slot` in the child's own module, so the result does not depend on CSS load order.

## Storybook

- **Stories sit beside their component:** `packages/ui/src/components/<Name>/<Name>.stories.tsx`, matched by `stories` in `apps/storybook/.storybook/main.ts`. They import the component relatively (`./Button`), so edits hot-reload without rebuilding `dist/`.
- **Tailwind runs through `@tailwindcss/vite`**, added in `main.ts` `viteFinal`. It compiles both the preview stylesheet and the components' CSS Modules.
- **`.storybook/preview.ts` imports `preview.css`**, which plays the consumer. It imports the library's `reference.css` (Tailwind reset + `--color-*` mapping, so story utilities like `text-muted-foreground` work) and `tokens.css`, `@source`s `packages/ui/src` so `className` overrides in stories get generated, and sets page colors.
- **One addon: `@storybook/addon-docs`**, with `remark-gfm` so MDX tables render. It turns `autodocs` into a props page and loads the Thai `.mdx` guideline pages (matched by `packages/ui/src/**/*.mdx`). A guideline page attaches to its stories with `<Meta of={…Stories} name="คู่มือการใช้งาน" />` and shows its example with `<Canvas of={…} />`. Dark mode is checked with a story that wraps components in `<div className="dark …">`. Hover, focus-visible and active are checked by hand.
- **One `<Name>.stories.tsx` per component**, titled `Components/<Name>`, tagged `autodocs`. `Button.stories.tsx` is the model: a `Playground` with a control for every prop, then one story per prop axis (variants, sizes, icons), a `StateMatrix` (variants × prop-driven states), `Dark`, `render` usage, and a `className` override. Write stories as correct real usage, e.g. `aria-label` on `iconOnly` buttons.

## Consumer contract

`packages/ui/README.md` documents this for users. Keep the two in step.

- The consumer imports `lab-package/styles.css` once.
- The consumer provides a CSS reset (Tailwind v4 preflight), `.dark` on an ancestor for dark mode, and `--font-heading` (used by `DialogTitle` and `AlertDialogTitle`).
- `react` / `react-dom` 19 are `peerDependencies`. Next.js is never a dependency.
- Renaming or removing an export, prop, variant, `data-slot` or token is a breaking change. Call it out in your summary.

## Checks after a change

Run the library's `typecheck`, `build` and `pack:check`, plus `build-storybook` when a component, its stories, or a `.md` / `.mdx` doc changed. Then confirm:

- Every `<Name>.md` in `git status` has its `<Name>.mdx` changed too, and the Storybook build lists each component's **คู่มือการใช้งาน** page.

And against `packages/ui/dist/`:

- Each component whose source starts with `"use client"` (currently AlertDialog, Dialog, InputGroup, InputOTP) still starts with it in `dist/components/<Name>/<Name>.js`.
- `grep -r "@/" dist` returns nothing, and no `*.stories.*` file is in `dist/`.
- The pack file list contains only `dist/**`, `README.md` and `package.json`.

## Publishing

Publishing is the maintainer's call (planned for Week 4). Agents get the release ready and stop at `npm run pack:check -w lab-package`.
