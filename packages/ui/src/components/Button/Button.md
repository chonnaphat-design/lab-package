# Button

**Purpose:** Starts an action on the current page, such as saving, confirming, opening a dialog or copying.

## When to use

- The user runs an action: submit a form, confirm a step, open a dialog, copy a value.
- A dialog's footer actions, such as "Cancel" and "Transfer".
- An icon-only action in a toolbar or dense row, such as "Copy link". It must have an accessible label.

## When not to use

| Instead of a button for…                                        | Use                                                                         |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Going to another page                                           | A link. If it must look like a button, see [Buttons that navigate](#buttons-that-navigate). |
| Status, category or count labels                                | **Badge**                                                                   |
| A button inside a text field, such as Search, Copy or Send      | **InputGroupButton** inside an InputGroup                                   |
| The confirming button of an alert dialog                        | **AlertDialogAction**. It also handles waiting for slow work.               |
| A second `primary` in the same area                             | `secondary`, `outline` or `ghost`                                           |
| Plain navigation inside running text                            | A text link. TODO: there is no Link component yet.                          |

## Writing the label

- **Start with a verb**, and add the object when the context isn't obvious: "Save changes", "Delete folder", "Copy link".
- **Be specific.** Avoid "OK", "Yes", "Submit" and "Click here".
- **Sentence case**, short, no end punctuation: "Add payee", not "Add Payee." Most systems agree; Apple uses title case.
- **Keep labels to a few words.** Buttons never wrap, so a long label makes the button wider.

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
import { Button } from "@chonny_iamsrithong/lab-package"

<Button type="submit">Save changes</Button>
```

- Button has no `"use client"` of its own. In Next.js, a file that passes a function such as `onClick` must start with `"use client"`. A submit button inside a form needs no handler, so it works in a Server Component.

## Props and variants

### `variant`: visual emphasis (default `primary`)

From most to least emphasis:

| Variant     | Use for                                                        | Look                                         |
| ----------- | -------------------------------------------------------------- | -------------------------------------------- |
| `primary`   | The main action in a view or area. **One per area.**           | Solid lime fill, dark green text             |
| `secondary` | Supporting actions beside a primary                            | Solid light-grey fill, dark text             |
| `outline`   | Neutral actions, "Cancel", toolbars                            | Light tinted fill with a thin border         |
| `ghost`     | Low-emphasis actions and icon buttons in dense UI              | No fill until hover                          |
| `link`      | An action that sits in text and should read like a link        | Green text, no fill, underlined on hover     |
| `danger`    | Actions that are hard to undo: delete, revoke, remove          | Soft red tint with red text                  |

This order matches Material, IBM Carbon, Atlassian and GitHub Primer: `ghost` is their ghost, invisible or subtle button, and `secondary` is Material's tonal button.

- **`danger`** is a soft red, not a solid fill. Many systems use a solid red for the final "Delete" in a confirmation. TODO: decide whether a solid danger style is needed. Use `danger` only for actions that are hard to undo, and make the label name what is destroyed, so the meaning doesn't depend on seeing red.
- **`link`** is for actions that should look like inline text. For going to another page, use a real link.

### `size`: height (default `md`)

| Size | Height | Text | Icon | Use for |
| ---- | ------ | ---- | ---- | ------- |
| `xs` | 24px   | 12px | 12px | Dense desktop UI only, such as table rows and toolbars |
| `sm` | 32px   | 14px | 16px | Compact areas |
| `md` | 36px   | 14px | 16px | Most buttons |
| `lg` | 40px   | 14px | 16px | Prominent actions |

Every size uses medium weight (500) and a pill shape.

**Target size:** WCAG's minimum is 24 × 24px, so `xs` meets it with no margin to spare. Leave space between `xs` buttons. Apple (44pt) and Android (48dp) ask for larger touch targets, so prefer `md` or `lg` on touch screens. Keep buttons in one group the same size.

### Other props

| Prop                    | Default  | What it does                                                                                                     |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `iconOnly`              | `false`  | A square button for a single icon, the same height as its `size`. **Always add `aria-label`.**                   |
| `type`                  | `button` | Set `type="submit"` on a form's submit button. The default never submits a form by accident.                     |
| `disabled`              | `false`  | Dims the button to 50% and blocks clicks. See [Disabled buttons](#disabled-buttons).                             |
| `focusableWhenDisabled` | `false`  | Keeps a disabled button reachable by keyboard, so the user can find it and learn why it's unavailable.          |
| `render`                | none     | Renders the button as another element, such as a link, with the same look.                                       |
| `nativeButton`          | `true`   | Set it to `false` whenever `render` is not a `<button>`.                                                         |
| `className`             | none     | For one-off layout tweaks, such as full width. Prefer a variant over restyling.                                  |

Native button attributes such as `onClick` and `aria-*` also work.

**Icon-only buttons:** the `aria-label` names the action, such as "Copy link", not the icon, such as "Copy icon". TODO: IBM Carbon requires a tooltip on icon-only buttons, but the package has no tooltip yet. **Buttons with icon and text:** don't add an `aria-label`, because the visible text is the name.

**Full width:** there is no prop. Use `className` for full width, for example on a sign-in form on mobile. TODO: decide whether full width becomes a prop.

**Loading:** there is no loading prop on Button. TODO: IBM Carbon, Shopify Polaris, Atlassian and GitHub Primer all have one. The only loading state in the package is AlertDialogAction's. Until Button has one, prevent double submits in the app.

### Buttons that navigate

A button does something; a link goes somewhere. If a link must look like a button, such as a "Get started" call to action, render it as a real link with `render` and `nativeButton={false}`. It stays a link for keyboards and screen readers. Don't open a dialog from it.

### Disabled buttons

Avoid disabling buttons, especially a form's submit button. Atlassian, GitHub Primer and GOV.UK all say to keep it active, and show what's wrong when it's pressed. When a button must be disabled, say why in visible text nearby. Use `focusableWhenDisabled` so keyboard users can still reach it.

### Placement

- **In dialogs**, the main action goes last, on the right. Dialog and AlertDialog footers do this for you.
- **When stacked**, the main action goes on top.
- TODO: **on full pages and forms**, IBM Carbon, GOV.UK and Microsoft Fluent put the main action first, on the left. Decide the rule for this product.
- Show two or three buttons in a group at most. Put more in a menu.

### States

| State     | How it is set           | Look                                                       |
| --------- | ----------------------- | ---------------------------------------------------------- |
| Hover     | Pointer over the button | Fill darkens or lightens slightly. `link` underlines.      |
| Focus     | Keyboard focus only     | Border in the ring colour plus a 3px soft ring             |
| Pressed   | While clicking          | Moves down 1px. Buttons that open a menu don't move.       |
| Disabled  | `disabled`              | 50% opacity, not clickable                                 |
| Invalid   | `aria-invalid`          | Red border and soft red ring                               |
| Expanded  | `aria-expanded`         | `outline` and `ghost` get a muted fill while the menu or panel they control is open. `secondary` keeps its resting look. |

Dark mode is applied automatically when a `.dark` class is set on a parent element. Each variant has its own dark colours.

**Focus contrast.** WCAG asks for 3:1 between the focus indicator and the colours next to it. The solid focus border meets it:

| Focus border against… | Light | Dark |
| --------------------- | ----- | ---- |
| The page              | 5.25  | 4.60 |
| `primary` fill        | 3.42  | 2.18 |
| `secondary` fill      | 4.77  | 3.50 |

The 3px soft ring around it is 50% see-through and is decoration only; it stays below 3:1.

TODO: in dark mode the border is 2.18:1 next to the lime `primary` fill. It still stands out against the dark page. No single grey reaches 3:1 against both the dark page and the lime, so fixing this needs a design decision, such as a different focus colour for `primary`.

### Text contrast

12px and 14px text needs 4.5:1. Every variant passes, at rest and on hover. These were measured on the real buttons in the week-1-lab app; the resting values were re-measured here and match.

| Variant     | Light | Light hover | Dark | Dark hover |
| ----------- | ----- | ----------- | ---- | ---------- |
| `primary`   | 5.72  | 6.15        | 4.50 | 4.95       |
| `secondary` | 16.12 | —           | 14.27 | —         |
| `outline`   | 18.43 | 17.63       | 17.34 | 16.13     |
| `ghost`     | 19.59 | 17.76       | 18.90 | 16.53     |
| `danger`    | 5.92  | 4.87        | 5.19 | 4.74       |
| `link`      | 5.69  | underline   | 10.06 | underline |

Dark `primary` at rest passes with no margin. Any change to the dark `--primary` or `--primary-foreground` can push it below 4.5:1.

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
| `--radius`               | Corner radius: 2.6 × `--radius`, a pill at every size                  |

Every token has a light and a dark value in the shipped stylesheet. To restyle every button, change a token rather than overriding single buttons.

## Example

Taken from the Button stories (`IconOnly`), reduced to one size:

```tsx
import { CopyIcon } from "lucide-react"
import { Button } from "@chonny_iamsrithong/lab-package"

<Button iconOnly aria-label="Copy link">
  <CopyIcon />
</Button>
```
