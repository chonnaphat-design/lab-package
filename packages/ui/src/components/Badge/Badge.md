# Badge

**Purpose:** A small, read-only pill label that shows the status or category of the thing next to it.

Other systems call this a status label, tag or lozenge. It is not a notification count, and it is not something to click.

## When to use

- **The status of a record** in a list, table or header, such as Paid, Pending, Draft, Archived or Overdue.
- **A short category** next to a title, such as a plan name or a type.

## When not to use

| Instead of a badge for…                                   | Use                                                                  |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| An action the user clicks to make something happen       | **Button**                                                           |
| A filter or a removable choice the user picks            | TODO: the package has no chip or tag-input component yet.            |
| An unread count or notification dot on an icon           | TODO: no counter component yet. Badge has no count or dot mode.      |
| More than two words, or a sentence                       | Plain text                                                           |
| A form error                                             | Input's or Textarea's `invalid`, with a message beside the field     |
| A message the user must notice now                       | TODO: the package has no alert or toast yet.                         |

Use badges sparingly. A page full of them stops drawing the eye, and each product area should have a small, fixed set of statuses.

## Writing the label

- **One word, two at most**, such as "Paid" or "Partially refunded". Keep it under about 20 characters.
- **Adjectives or past tense**, which describe a state: "Overdue", "Refunded". Avoid verbs, which read as actions: "Refund".
- **Sentence case**: "Partially refunded", not "PARTIALLY REFUNDED". Uppercase is harder to read.
- **The words carry the meaning, not the colour.** "Overdue" must make sense in grey too. When the word alone is unclear, add context, such as "Payment: failed".
- **Badges never wrap or cut off.** A long label makes the badge wider and can push the layout. TODO: no maximum width or truncation is defined.

## Import and use

Install the package, then import its stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install @chonny_iamsrithong/lab-package
```

```tsx
import "@chonny_iamsrithong/lab-package/styles.css"
```

Then import the component where you use it:

```tsx
import { Badge } from "@chonny_iamsrithong/lab-package"

<Badge variant="secondary">Pending</Badge>
```

- Badge has no `"use client"` and needs none: it renders in Server Components.

## Props and variants

### `variant`: visual style (default `primary`)

| Variant     | Look                                     | Used in the stories for |
| ----------- | ---------------------------------------- | ----------------------- |
| `primary`   | Solid lime fill, dark green text         | Paid                    |
| `secondary` | Solid light-grey fill, dark text         | Pending                 |
| `outline`   | Light tinted fill with a thin border     | Draft                   |
| `ghost`     | No fill, plain text                      | Archived                |
| `danger`    | Soft red tint with red text              | Overdue                 |
| `link`      | Green text, no fill                      | (no status example)     |

**Variants describe looks, not meanings,** except `danger`. Mature systems name badge colours by meaning: success, warning, info, error and neutral. This set has only `danger`.

TODO: decide these before relying on the stories' pairs:
- **No success, warning or info.** There is nothing for "Due soon" (warning) or "In review" (info).
- **`primary` is the brand lime, not a success green.** "Paid" in `primary` reads as brand emphasis rather than "done".
- **The stories' pairs come from one story** ("Typical status labels") and aren't a confirmed rule.

**`link`** looks like a hyperlink, green text with no fill. Don't use it on a badge that isn't a link.

### Other props

| Prop           | Default | What it does                                                                                       |
| -------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `render`       | none    | Renders the badge as another element. `render={<a href="…" />}` makes it a link. See the caution below. |
| `aria-invalid` | none    | Adds a red border, for a badge that flags a problem, such as "Missing".                            |
| `className`    | none    | For one-off layout tweaks. Prefer a variant over restyling.                                        |

Badge has **no `size` prop**. Every badge is 20px tall, with 12px medium-weight text, 8px side padding and a pill shape. Icons inside are sized to 12px automatically. An icon goes before the text and only repeats what the text says.

**Badges as links:** GOV.UK and IBM Carbon advise against it, because people can't tell clickable badges from static ones. If you do it:
- make the link's purpose obvious from its text;
- leave space around it. A 20px-tall badge is below the 24px minimum target size, so neighbouring targets must sit far enough away.

TODO: decide whether link badges stay in the system.

**`aria-invalid`:** no reference design system uses it on badges; it is meant for form fields. Prefer `danger` with a clear word. TODO: decide whether to keep it.

### States

| State   | When                     | Look                                                             |
| ------- | ------------------------ | ---------------------------------------------------------------- |
| Hover   | Only when it is a link   | Fill darkens slightly. `outline` and `ghost` turn muted. `link` underlines. |
| Focus   | Keyboard focus on a link | A 3px soft ring                                                  |
| Invalid | `aria-invalid`           | Red border. No ring.                                             |

A badge that isn't a link never changes on hover, so a plain label doesn't look clickable.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

### Accessibility

- Screen readers read a badge as plain text in the flow of the page. Don't give a static badge a live announcement. TODO: no pattern yet for a badge whose status changes while the page is open.
- Text contrast, measured on the real badges. 12px text needs 4.5:1, and every variant passes:

| Variant     | Light | Dark |
| ----------- | ----- | ---- |
| `primary`   | 5.72  | 4.50 |
| `secondary` | 16.12 | 14.27 |
| `outline`   | 18.43 | 17.34 |
| `ghost`     | 19.59 | 18.90 |
| `danger`    | 5.92  | 5.19 |
| `link`      | 5.69  | 10.06 |

Dark `primary` passes with no margin. Any change to the dark `--primary` or `--primary-foreground` can push it below 4.5:1. Hover states on link badges were not measured.

## Tokens used

| Token                    | Used for                                                    |
| ------------------------ | ----------------------------------------------------------- |
| `--primary`              | `primary` fill and its link hover                           |
| `--primary-foreground`   | `primary` text                                              |
| `--secondary`            | `secondary` fill and its link hover                         |
| `--secondary-foreground` | `secondary` text                                            |
| `--foreground`           | `outline` text. Mixed into the dark `primary` link hover.   |
| `--input`                | `outline` fill                                              |
| `--border`               | `outline` border                                            |
| `--muted`                | `ghost` hover and `outline` link hover fill                 |
| `--muted-foreground`     | `ghost` hover and `outline` link hover text                 |
| `--destructive`          | `danger` text and tint, and the invalid border              |
| `--link`                 | `link` text                                                 |
| `--ring`                 | Focus ring on link badges                                   |
| `--radius`               | Corner radius: 2.6 × `--radius`, a pill                     |

## Example

The `Statuses` story:

```tsx
import { Badge } from "@chonny_iamsrithong/lab-package"

<Badge>Paid</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="ghost">Archived</Badge>
<Badge variant="danger">Overdue</Badge>
```
