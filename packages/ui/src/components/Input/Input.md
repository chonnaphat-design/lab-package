# Input

**Purpose:** A single-line field for typing a short value, such as a name, email, amount, password or search.

## When to use

- Short free text on one line: name, email, amount, search term, URL, phone number, password.
- Picking a file to upload, with `type="file"`.

## When not to use

| Instead of an input for…                                         | Use                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| Text that can run to several lines, such as a note               | **Textarea**                                          |
| A field with an icon, fixed text or a button inside its border   | **InputGroup** with InputGroupInput                   |
| A one-time code or PIN, one character per box                    | **InputOTP**                                          |
| Choosing from a fixed list of options                            | TODO: the package has no Select, Radio or Checkbox yet. |

## Props and variants

Input has **no `variant` or `size` props**. Every input is 36px tall, full width of its container, with 12px side padding and a pill shape. Text is 16px on screens narrower than 768px, so phones don't zoom in on focus, and 14px from 768px.

| Prop                    | Default | What it does                                                                                           |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `type`                  | `text`  | Any native type. The stories show `text`, `email`, `password`, `number`, `search`, `tel`, `url` and `file`. |
| `invalid`               | `false` | Error state: red border and ring, and screen readers hear the field is invalid.                        |
| `disabled`              | `false` | Dims to 50% and can't be clicked or focused.                                                           |
| `readOnly`              | `false` | The value can be selected and copied but not changed.                                                  |
| `placeholder`           | none    | Example text shown while empty, in a muted colour. It is not a label.                                  |
| `defaultValue`          | none    | Starting value.                                                                                        |
| `value` + `onChange`    | none    | Lets the app control the value.                                                                        |
| `className`             | none    | For one-off layout tweaks, such as a fixed width.                                                      |

Native input attributes such as `inputMode`, `autoComplete`, `name` and `required` also work.

**Always give it a label.** Use a visible `<label htmlFor>` pointing at the input's `id`, or `aria-label` when there is no visible label.

### States

| State     | How it is set   | Look                                         |
| --------- | --------------- | -------------------------------------------- |
| Empty     | No value        | Placeholder in the muted text colour         |
| Focus     | Keyboard focus  | Border turns `--ring` with a 3px soft ring   |
| Invalid   | `invalid`       | Red border and a soft red ring               |
| Disabled  | `disabled`      | 50% opacity, not-allowed cursor              |
| Read-only | `readOnly`      | Looks the same as an editable input          |

TODO: read-only has no look of its own. Confirm whether it should.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Tokens used

| Token                | Used for                                                    |
| -------------------- | ----------------------------------------------------------- |
| `--input`            | Border, and the fill at 30%                                 |
| `--muted-foreground` | Placeholder text                                            |
| `--foreground`       | The file picker's button text                               |
| `--ring`             | Focus border and ring                                       |
| `--destructive`      | Invalid border and ring                                     |
| `--radius`           | Corner radius: 2.6 × `--radius`, a pill                     |

Typed text takes the page's text colour.

## Example

The `WithLabel` story, written out with its default controls:

```tsx
import { Input } from "lab-package"

<div className="grid gap-2">
  <label htmlFor="input-email" className="text-sm font-medium">
    Work email
  </label>
  <Input id="input-email" type="email" placeholder="name@acme.com" />
</div>
```
