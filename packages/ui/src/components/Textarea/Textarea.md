# Textarea

**Purpose:** A multi-line field for typing text that can run longer than one line, such as a note or message.

## When to use

- Free text that may need several lines: a note to a recipient, a description, a message.

## When not to use

| Instead of a textarea for…                                     | Use                                     |
| -------------------------------------------------------------- | --------------------------------------- |
| A short single-line value, such as a name or amount            | **Input**                               |
| A message box with buttons attached, such as attach and send   | **InputGroup** with InputGroupTextarea  |
| Rich text with formatting                                      | TODO: the package has no rich-text editor. |

## Props and variants

Textarea has **no `variant` or `size` props**. It is full width of its container, at least 64px tall, with 12px padding and 14px rounded corners. Text is 16px on screens narrower than 768px, so phones don't zoom in on focus, and 14px from 768px.

**It grows with its content** instead of scrolling, and the user can't drag to resize it. TODO: growing relies on a newer CSS feature. Confirm what happens in browsers without it, and whether a maximum height is needed.

| Prop                 | Default | What it does                                                                     |
| -------------------- | ------- | -------------------------------------------------------------------------------- |
| `invalid`            | `false` | Error state: red border and ring, and screen readers hear the field is invalid. |
| `disabled`           | `false` | Dims to 50% with a not-allowed cursor.                                           |
| `readOnly`           | `false` | The text can be selected and copied but not changed.                             |
| `placeholder`        | none    | Example text shown while empty, in a muted colour. It is not a label.            |
| `rows`               | none    | TODO: the stories offer it, but it is unclear what it changes while the field grows with its content. |
| `defaultValue`       | none    | Starting text.                                                                   |
| `value` + `onChange` | none    | Lets the app control the text.                                                   |
| `className`          | none    | For one-off layout tweaks.                                                       |

Native textarea attributes such as `name`, `maxLength` and `required` also work.

**Always give it a label.** Use a visible `<label htmlFor>` pointing at the textarea's `id`, or `aria-label` when there is no visible label.

### States

| State     | How it is set   | Look                                         |
| --------- | --------------- | -------------------------------------------- |
| Empty     | No value        | Placeholder in the muted text colour         |
| Focus     | Keyboard focus  | Border turns `--ring` with a 3px soft ring   |
| Invalid   | `invalid`       | Red border and a soft red ring               |
| Disabled  | `disabled`      | 50% opacity, not-allowed cursor              |
| Read-only | `readOnly`      | Looks the same as an editable textarea       |

TODO: read-only has no look of its own. Confirm whether it should.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Tokens used

| Token                | Used for                                  |
| -------------------- | ----------------------------------------- |
| `--input`            | Border, and the fill at 30%               |
| `--muted-foreground` | Placeholder text                          |
| `--ring`             | Focus border and ring                     |
| `--destructive`      | Invalid border and ring                   |
| `--radius`           | Corner radius: 1.4 × `--radius` (14px)    |

Typed text takes the page's text colour.

## Example

The `WithLabel` story, written out with its default controls:

```tsx
import { Textarea } from "lab-package"

<div className="grid gap-2">
  <label htmlFor="textarea-note" className="text-sm font-medium">
    Note to recipient
  </label>
  <Textarea id="textarea-note" placeholder="Add a note…" />
</div>
```
