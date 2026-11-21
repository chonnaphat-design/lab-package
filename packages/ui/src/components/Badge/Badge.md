# Badge

**Purpose:** A small pill label that shows the status, category or count of something nearby.

## When to use

- The status of a record in a list or table, such as Paid, Pending, Draft or Overdue.
- A short category or tag next to a title.
- A link to a filtered view, such as a "Statement" badge that opens the statement. Render it as a link (see `render` below).

## When not to use

| Instead of a badge for…                         | Use                                                          |
| ----------------------------------------------- | ------------------------------------------------------------ |
| An action the user clicks to make something happen | **Button**                                                 |
| More than two or three words                    | Plain text                                                   |
| A form error                                    | Input's or Textarea's `invalid`, with a message beside the field |
| A notification the user must notice             | TODO: the package has no alert or toast yet.                 |

## Props and variants

### `variant`: visual style (default `primary`)

| Variant     | Look                                   | Used in the stories for |
| ----------- | -------------------------------------- | ----------------------- |
| `primary`   | Solid lime fill, dark green text       | Paid                    |
| `secondary` | Solid light-grey fill, dark text       | Pending                 |
| `outline`   | Light tinted fill with a border        | Draft                   |
| `ghost`     | No fill, plain text                    | Archived                |
| `danger`    | Soft red tint with red text            | Overdue                 |
| `link`      | Green text, no fill, underlined on hover | (no status example)   |

TODO: the status-to-variant pairs above come from one story ("Typical status labels"). Confirm them as the rule before relying on them.

### Other props

| Prop           | Default | What it does                                                                                     |
| -------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `render`       | none    | Renders the badge as another element. Use `render={<a href="…" />}` to make it a link.           |
| `aria-invalid` | none    | Adds a red border, for a badge that flags a problem, such as "Missing". |
| `className`    | none    | For one-off layout tweaks. Prefer a variant over restyling.                                      |

Badge has **no `size` prop**. Every badge is 20px tall, with 12px medium-weight text, 8px side padding and a pill shape. Icons inside are sized to 12px automatically.

### States

| State      | When                     | Look                                                                    |
| ---------- | ------------------------ | ----------------------------------------------------------------------- |
| Hover      | Only when it is a link   | Fill darkens slightly. `outline` turns muted. `link` underlines.        |
| Focus      | Keyboard focus on a link | A 3px soft ring                                                         |
| Invalid    | `aria-invalid`           | Red border. No ring.                                                    |


TODO: `ghost` and `link` badges also change on hover when they are **not** links, so a plain label reacts to the pointer. Confirm whether that is intended.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Tokens used

| Token                    | Used for                                                                          |
| ------------------------ | --------------------------------------------------------------------------------- |
| `--primary`              | `primary` fill and its link hover                                                 |
| `--primary-foreground`   | `primary` text                                                                    |
| `--secondary`            | `secondary` fill and its link hover                                               |
| `--secondary-foreground` | `secondary` text                                                                  |
| `--foreground`           | `outline` text. Mixed into the dark `primary` link hover.                         |
| `--input`                | `outline` fill                                                                    |
| `--border`               | `outline` border                                                                  |
| `--muted`                | `ghost` hover and `outline` link hover fill                                       |
| `--muted-foreground`     | `ghost` hover and `outline` link hover text                                       |
| `--destructive`          | `danger` text and tint, and the invalid border                                    |
| `--link`                 | `link` text                                                                       |
| `--ring`                 | Focus ring                                                                        |
| `--radius`               | Corner radius: 2.6 × `--radius`, a pill                                           |

## Example

The `Statuses` story:

```tsx
import { Badge } from "lab-package"

<Badge>Paid</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="ghost">Archived</Badge>
<Badge variant="danger">Overdue</Badge>
```
