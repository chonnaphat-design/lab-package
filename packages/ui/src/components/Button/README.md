# Button

Triggers an action. Built on [Base UI `Button`](https://base-ui.com/react/components/button), styled entirely from design tokens through a CSS Module.

```tsx
import { Button } from "lab-package"

<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="danger">Delete account</Button>
```

- Live examples: the `/design-system` showcase and `/design-system/ledger` (light/dark previews, usage, a11y audit) in the week-1-lab app, where this component was built. This package has no showcase yet.

---

## Files

```
Button/
├── Button.tsx          markup + behavior: maps props to data-* attributes, no style classes
├── Button.module.css   every style rule, written with Tailwind @apply + tokens
├── index.ts            public exports: Button, ButtonProps, ButtonVariant, ButtonSize
└── README.md           this file
```

## API

| Prop                    | Type                                                                     | Default     | Notes                                                                                               |
| ----------------------- | ------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------- |
| `variant`               | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` | `"primary"` | Visual style. See [Variants](#variants).                                                            |
| `size`                  | `"xs" \| "sm" \| "md" \| "lg"`                                           | `"md"`      | Height, padding, gap and icon size. See [Sizes](#sizes).                                            |
| `iconOnly`              | `boolean`                                                                | `false`     | Square button for a single icon. **Requires `aria-label`.**                                         |
| `className`             | `string`                                                                 | —           | Override. Any Tailwind utility here beats the component's own styles (see [Overrides](#overrides)). |
| `disabled`              | `boolean`                                                                | `false`     | From Base UI. Dims to 50% and blocks pointer events.                                                |
| `focusableWhenDisabled` | `boolean`                                                                | `false`     | From Base UI. Keeps a disabled button in the tab order (e.g. to show a tooltip explaining why).     |
| `render`                | `ReactElement \| function`                                               | —           | From Base UI. Render as another element, e.g. a Next.js `<Link>`.                                   |
| `nativeButton`          | `boolean`                                                                | `true`      | From Base UI. Set to `false` when `render` is not a `<button>`.                                     |
| …rest                   | `ButtonPrimitive.Props`                                                  | —           | All native `<button>` attributes (`type`, `onClick`, `aria-*`, …).                                  |

## Anatomy

`<Button variant="outline" size="sm" iconOnly aria-label="Add">` renders:

```html
<button
  type="button"
  data-slot="button"          <!-- stable hook other components target -->
  data-variant="outline"
  data-size="sm"
  data-icon-only              <!-- present only when iconOnly -->
  aria-label="Add"
  class="Button-module__…__root"
>
  <svg …/>
</button>
```

The TSX only writes attributes. `Button.module.css` turns them into styles:

| Selector                               | Responsible for                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.root`                                | Base: layout, pill shape, typography, transitions, focus/active/disabled/invalid states, icon sizing |
| `.root[data-variant="…"]`              | Colors per variant                                                                                   |
| `:global(.dark) .root[…]`              | Dark-theme adjustments (Tailwind's `dark:` cannot be used inside a CSS Module)                       |
| `.root[data-size="…"]`                 | Height, padding, gap, font and icon size                                                             |
| `.root[data-icon-only][data-size="…"]` | Square dimensions, no padding                                                                        |

All rules sit in `@layer components`, below Tailwind's `utilities` layer.

## Variants

| Variant     | Use for                                        | Background                         | Text                     | Border      | Hover                                                                     |
| ----------- | ---------------------------------------------- | ---------------------------------- | ------------------------ | ----------- | ------------------------------------------------------------------------- |
| `primary`   | The main action in a view (one per area)       | `--primary`                        | `--primary-foreground`   | transparent | bg `--primary` at 80% (dark: `--primary` mixed 15% toward `--foreground`) |
| `secondary` | Supporting actions next to a primary           | `--secondary`                      | `--secondary-foreground` | transparent | bg `--secondary` mixed 5% toward `--foreground`                           |
| `outline`   | Neutral actions, toolbars, "Cancel"            | `--input` at 30%                   | inherits `--foreground`  | `--border`  | bg `--input` at 50%                                                       |
| `ghost`     | Low-emphasis actions, icon buttons in dense UI | transparent                        | inherits `--foreground`  | transparent | bg `--muted` (dark: `--muted` at 50%)                                     |
| `danger`    | Destructive actions (delete, revoke)           | `--destructive` at 10% (dark: 20%) | `--destructive`          | transparent | bg `--destructive` at 20% (dark: 25%)                                     |
| `link`      | Inline, text-like actions                      | transparent                        | `--link`                 | transparent | underline (offset 4px)                                                    |

`secondary`, `outline` and `ghost` also style `aria-expanded="true"` (e.g. when the button opens a menu) like their hover state.

## Sizes

Spacing unit is Tailwind's `0.25rem` (4px).

| Size | Height        | Padding x | Gap | Font             | Icon            | Icon-only square |
| ---- | ------------- | --------- | --- | ---------------- | --------------- | ---------------- |
| `xs` | 24px (`h-6`)  | 10px      | 4px | 12px (`text-xs`) | 12px (`size-3`) | 24 × 24          |
| `sm` | 32px (`h-8`)  | 12px      | 4px | 14px (`text-sm`) | 16px (`size-4`) | 32 × 32          |
| `md` | 36px (`h-9`)  | 12px      | 6px | 14px             | 16px            | 36 × 36          |
| `lg` | 40px (`h-10`) | 16px      | 6px | 14px             | 16px            | 40 × 40          |

Font weight is `500` (`font-medium`) at every size. Corner radius is `rounded-4xl` at every size, so buttons are pills.

### Icons

```tsx
<Button>
  <PlusIcon data-icon="inline-start" /> New transfer
</Button>
<Button variant="outline">
  Continue <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button variant="ghost" size="sm" iconOnly aria-label="Copy link">
  <CopyIcon />
</Button>
```

- Icons are sized automatically (table above) unless they carry their own `size-*` class.
- Mark a leading/trailing icon with `data-icon="inline-start"` / `"inline-end"`: the padding on that side tightens (xs/sm 8px, md 10px, lg 12px) so the icon looks optically centered.
- Icons get `pointer-events: none` and never shrink.

## States

| State    | Trigger                                               | Style                                                                                 |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Focus    | `:focus-visible` (keyboard)                           | Border `--ring` + 3px ring `--ring` at 50% (danger: `--destructive` 20%, dark 40%)    |
| Pressed  | `:active` (not on menu triggers with `aria-haspopup`) | Moves down 1px                                                                        |
| Disabled | `disabled` / `data-disabled`                          | 50% opacity, no pointer events                                                        |
| Invalid  | `aria-invalid="true"`                                 | Border `--destructive` + 3px ring `--destructive` at 20% (dark: border 50%, ring 40%) |
| Expanded | `aria-expanded="true"`                                | Same as hover for secondary / outline / ghost                                         |

## Design tokens

Every color and radius comes from `src/styles/tokens.css` (the `--color-*` mapping is in `src/styles/reference.css`). Change the token there, not the button.

| Token                    | Light                        | Dark                         | Used for                                       |
| ------------------------ | ---------------------------- | ---------------------------- | ---------------------------------------------- |
| `--primary`              | `oklch(0.841 0.238 128.85)`  | `oklch(0.768 0.233 130.85)`  | primary background                             |
| `--primary-foreground`   | `oklch(0.405 0.101 131.063)` | `oklch(0.405 0.101 131.063)` | primary text                                   |
| `--secondary`            | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | secondary background                           |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)`  | `oklch(0.985 0 0)`           | secondary text                                 |
| `--foreground`           | `oklch(0.153 0.006 107.1)`   | `oklch(0.988 0.003 106.5)`   | outline / ghost text, secondary hover mix      |
| `--input`                | `oklch(0.93 0.007 106.5)`    | `oklch(1 0 0 / 15%)`         | outline background                             |
| `--border`               | `oklch(0.93 0.007 106.5)`    | `oklch(1 0 0 / 10%)`         | outline border                                 |
| `--muted`                | `oklch(0.966 0.005 106.5)`   | `oklch(0.286 0.016 107.4)`   | ghost hover, expanded                          |
| `--destructive`          | `oklch(0.48 0.2 27.325)`     | `oklch(0.704 0.191 22.216)`  | danger text, tint, invalid state               |
| `--link`                 | `oklch(0.5 0.15 131)`        | `oklch(0.768 0.233 130.85)`  | link text                                      |
| `--ring`                 | `oklch(0.53 0.021 106.9)`    | `oklch(0.58 0.031 107.3)`    | focus border and ring                          |
| `--radius`               | `0.625rem`                   | —                            | `rounded-4xl` = `--radius × 2.6` = 26px (pill) |

`--link` exists because lime `--primary` works as a fill but reads at only 1.5:1 as text on white; in dark mode it is the same lime as `--primary`.

## Accessibility

- Renders a real `<button>` with `type="button"` (Base UI default), so it never submits a form by accident. Pass `type="submit"` explicitly for form submits.
- `iconOnly` buttons have no visible text: **always pass `aria-label`**.
- When rendering as a link, use `render={<Link href="…" />}` **and** `nativeButton={false}` so Base UI applies the right semantics.
- Focus is visible only for keyboard users (`:focus-visible`).

### Contrast

Text contrast per variant, measured in the browser on the real buttons (hovered with the pointer, colors sampled from a canvas, WCAG 2.x formula). Button text is 14px medium, so the requirement is **4.5:1** (`xs` is 12px, same requirement). Every state passes.

| Variant     | Light | Light hover | Dark    | Dark hover  |
| ----------- | ----- | ----------- | ------- | ----------- |
| `primary`   | 5.72  | 6.15        | 4.50 ⚠️ | 4.95        |
| `secondary` | 16.12 | —           | 14.27   | —           |
| `outline`   | 18.43 | 17.63       | 17.34   | 16.13       |
| `ghost`     | 19.59 | 17.76       | 18.90   | 16.53       |
| `danger`    | 5.92  | 4.87        | 5.19    | 4.74        |
| `link`      | 5.69  | (underline) | 10.06   | (underline) |

The automated axe audit in the ledger only checks the resting state, so re-measure hover states by hand after changing a variant.

### Hover rules that exist for contrast

- **Dark `primary` hover lightens instead of fading.** The light-theme `hover:bg-primary/80` would let the dark page show through, dropping the dark-green text to 2.96:1. Dark mode mixes 15% `--foreground` into `--primary` instead (4.95:1). Badge's link-rendered `primary` uses the same rule.
- **Dark `danger` hover is capped at `/25`.** `/30` dropped `--destructive` text to 4.30:1; `/25` gives 4.74:1 and is still visibly darker than the `/20` resting tint.

### Known issues

- **Dark `primary` at rest is exactly 4.50:1.** It passes, with no margin; any change to `--primary` or `--primary-foreground` in dark mode can push it below. Darkening dark `--primary-foreground` slightly would add headroom.

## Overrides

`className` is merged after the module class, and because module rules live in `@layer components`, Tailwind utilities win without `!important`:

```tsx
<Button className="w-full">Full width</Button>
<Button variant="outline" className="rounded-md">Square-ish corners</Button>
```

Prefer a variant or token change over one-off overrides when the same look is needed in more than one place.

## Composition

```tsx
// As a Next.js link
<Button nativeButton={false} render={<Link href="/design-system/ledger" />}>
  Components ledger
</Button>

// As a Base UI trigger
<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
```

Other components build on Button:

| Component          | How                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DialogContent`    | Close button: `variant="ghost" size="sm" iconOnly`                                                                                 |
| `DialogFooter`     | `showCloseButton`: `variant="outline"`                                                                                             |
| `InputGroupButton` | Defaults to `variant="ghost" size="xs"`; `InputGroup.module.css` tightens padding and font via `.root .button[data-slot="button"]` |

Because those rules target `data-slot="button"`, keep that attribute when changing the markup.

## Changing the Button

- **New look for an existing variant:** edit its rule in `Button.module.css`, or the token in `src/styles/tokens.css` if the change should apply everywhere.
- **New variant:** add it to `ButtonVariant` in `Button.tsx`, add `.root[data-variant="…"]` (plus a `:global(.dark)` rule if needed) in the module, then add it to the `/design-system` showcase and the ledger preview registry in the week-1-lab app.
- After any change, open `/design-system/ledger` in the week-1-lab app and check the Button row in both themes, then re-measure hover states by hand (see [Contrast](#contrast)).
