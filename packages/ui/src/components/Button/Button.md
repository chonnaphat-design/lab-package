# Button

**Purpose:** Starts an action the user chooses, such as saving, confirming, opening a dialog or copying.

## When to use

- The user runs an action on the current page: submit a form, confirm a step, open a dialog, copy a value.
- A dialog's footer actions, such as "Cancel" and "Transfer".
- An icon-only action in a toolbar or dense row, such as "Copy link". It must have an accessible label.
- A link that should look like a button, such as a call to action that goes to another page. Use the `render` prop.

## When not to use

- **Status, category or count labels.** Use **Badge**.
- **A button inside a text field**, such as Search, Copy or Send next to an input. Use **InputGroupButton** inside an InputGroup. It is already sized and spaced for that slot.
- **Several primary buttons in one area.** Use one `primary` for the main action and `secondary`, `outline` or `ghost` for the rest.
- **Plain navigation inside running text.** TODO: there is no Link component yet. Confirm whether `variant="link"` is the intended choice here or whether a plain text link is.

## Props and variants

### `variant`: visual emphasis (default `primary`)

| Variant     | Use for                                                    | Look                                   |
| ----------- | ---------------------------------------------------------- | -------------------------------------- |
| `primary`   | The main action in a view or area. Use one per area.       | Solid lime fill, dark green text       |
| `secondary` | Supporting actions beside a primary                        | Solid light-grey fill, dark text       |
| `outline`   | Neutral actions, "Cancel", toolbars                        | Light tinted fill with a border        |
| `ghost`     | Low-emphasis actions and icon buttons in dense UI          | No fill until hover                    |
| `danger`    | Destructive actions: delete, revoke, remove                | Soft red tint with red text            |
| `link`      | Text-like actions                                          | Green text with no fill, underlined on hover |

### `size`: height and padding (default `md`)

| Size | Height | Text | Icon |
| ---- | ------ | ---- | ---- |
| `xs` | 24px   | 12px | 12px |
| `sm` | 32px   | 14px | 16px |
| `md` | 36px   | 14px | 16px |
| `lg` | 40px   | 14px | 16px |

Every size uses medium weight (500) and a fully rounded pill shape.

### Other props

| Prop                    | Default | What it does                                                                                                                                  |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `iconOnly`              | `false` | Makes a square button for a single icon, the same height as its `size`. **Always add `aria-label`**, because there is no visible text.        |
| `disabled`              | `false` | Dims the button to 50% opacity and blocks clicks.                                                                                             |
| `focusableWhenDisabled` | `false` | Keeps a disabled button reachable by keyboard, for example so a tooltip can explain why it is disabled.                                      |
| `render`                | none    | Renders the button as another element, such as a link, with the same look.                                                                    |
| `nativeButton`          | `true`  | Set it to `false` whenever `render` is not a `<button>`, for example a link.                                                                  |
| `type`                  | `button` | Set `type="submit"` on a form's submit button. The default never submits a form by accident.                                                |
| `className`             | none    | For one-off layout tweaks such as full width. Prefer a variant over restyling.                                                                |

Native button attributes such as `onClick` and `aria-*` also work.

### States

| State     | How it is set           | Look                                                       |
| --------- | ----------------------- | ---------------------------------------------------------- |
| Hover     | Pointer over the button | Fill darkens or lightens slightly. `link` underlines.      |
| Focus     | Keyboard focus only     | A 3px soft ring around the button                          |
| Pressed   | While clicking          | Moves down 1px. Buttons that open a menu don't move.      |
| Disabled  | `disabled`              | 50% opacity, not clickable                                 |
| Invalid   | `aria-invalid`          | Red border and soft red ring                               |
| Expanded  | `aria-expanded`         | `outline` and `ghost` get a muted fill while the menu or panel they control is open. `secondary` keeps its resting look. |

Dark mode is applied automatically when a `.dark` class is set on a parent element. Each variant has its own dark colors.

## Tokens used

| Token                    | Used for                                                               |
| ------------------------ | ---------------------------------------------------------------------- |
| `--primary`              | `primary` fill and its hover                                           |
| `--primary-foreground`   | `primary` text                                                         |
| `--secondary`            | `secondary` fill and its hover                                         |
| `--secondary-foreground` | `secondary` text                                                       |
| `--foreground`           | `outline` and `ghost` text. Mixed into the `secondary` hover and the dark `primary` hover. |
| `--input`                | `outline` fill and its hover                                           |
| `--border`               | `outline` border                                                       |
| `--muted`                | `ghost` hover, and the expanded fill for `outline` and `ghost`         |
| `--destructive`          | `danger` text and tint, and the invalid border and ring                |
| `--link`                 | `link` text                                                            |
| `--ring`                 | Focus border and ring                                                  |
| `--radius`               | Corner radius. The button uses 2.6 × `--radius`, which is a pill at every size. |

Every token has a light and a dark value in the shipped stylesheet. Change a token to restyle every button. Don't override single buttons.

## Example

Taken from the Button stories (`IconOnly`), reduced to one size:

```tsx
import { CopyIcon } from "lucide-react"
import { Button } from "lab-package"

<Button iconOnly aria-label="Copy link">
  <CopyIcon />
</Button>
```
