# InputGroup

**Purpose:** A text field with icons, fixed text or small buttons attached inside its border, so they read as one control.

## When to use

- A search field with a search icon and a "Go" button.
- An amount with a fixed currency before or after it, such as `$` and `USD`.
- An email with a fixed domain after it, such as `@acme.com`.
- A read-only value with a copy button, such as an invoice link.
- A code field with an "Apply" button, such as a promo code.
- A message box with a header above it, or attach and send buttons below it.

## When not to use

| Instead of an input group for…                               | Use                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| A plain field with nothing attached                          | **Input** or **Textarea**                                    |
| A full-size button beside the field, such as a form's submit | **Button** next to the field                                 |
| Help text or an error message under the field                | TODO: the package has no field-description or error-message component yet. |

## Anatomy

| Part                   | Role                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| **InputGroup**         | The border and fill around everything. Holds one control and its addons. |
| **InputGroupInput**    | The single-line control. Same props as Input.                           |
| **InputGroupTextarea** | The multi-line control. Same props as Textarea.                         |
| **InputGroupAddon**    | A slot beside, above or below the control, holding icons, text or buttons. |
| **InputGroupText**     | Fixed text in an addon, such as `$` or `@acme.com`.                     |
| **InputGroupButton**   | A small button in an addon.                                             |

Use one control per group.

## Props and variants

InputGroup has **no `variant` or `size` props**. A single-line group is 36px tall with a pill shape. With a textarea it grows with the text and has 14px corners. With an addon above or below, it stacks and has 18px corners.

### InputGroup

| Prop       | Default | What it does                                                                                                    |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `disabled` | `false` | Dims the addons to 50% and tells screen readers the group is disabled. **It does not disable the control or the buttons.** Also set `disabled` on each of them. |

### InputGroupAddon

| Prop    | Default        | What it does                                                         |
| ------- | -------------- | -------------------------------------------------------------------- |
| `align` | `inline-start` | `inline-start`: before the control. `inline-end`: after it. `block-start`: above it, full width. `block-end`: below it, full width. |

Clicking an addon outside its buttons moves focus to the input. TODO: with a textarea, clicking an addon does not move focus. Confirm whether it should.

TODO: the stories draw a divider between a block addon and the textarea with a class, not a prop. Decide whether it should become a prop.

### InputGroupButton

| Prop       | Default  | What it does                                                         |
| ---------- | -------- | -------------------------------------------------------------------- |
| `variant`  | `ghost`  | Any Button variant. The stories use `ghost`, `secondary` and `primary`. |
| `size`     | `xs`     | `xs` (24px) or `sm` (32px). Larger sizes don't fit the group.        |
| `iconOnly` | `false`  | A square icon button. **Always add `aria-label`.**                   |
| `type`     | `button` | Set `type="submit"` only if it submits the form.                     |
| `disabled` | `false`  | Disables the button.                                                 |

### InputGroupInput and InputGroupTextarea

They take the same props as [Input](../Input/Input.md) and [Textarea](../Textarea/Textarea.md), including `invalid`, `disabled` and `placeholder`. Their own border, fill and ring are removed: the group draws them.

**Always label the control**, with a visible `<label htmlFor>` or `aria-label`. An icon in an addon is not a label.

### States

| State    | How it is set                      | Look                                                     |
| -------- | ---------------------------------- | -------------------------------------------------------- |
| Focus    | Keyboard focus on the control      | The whole group gets the `--ring` border and 3px soft ring |
| Invalid  | `invalid` on the control           | The whole group gets a red border and soft red ring      |
| Disabled | `disabled` on the group and control | Addons at 50%, control at 50% and not usable            |

A disabled group tells screen readers it is disabled. Its dimmed addon text is below 4.5:1 contrast on purpose: WCAG doesn't require contrast for disabled controls, and full contrast would make it look enabled.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Tokens used

| Token                | Used for                                 |
| -------------------- | ---------------------------------------- |
| `--input`            | Group border, and the fill at 30%        |
| `--muted-foreground` | Addon text and icons, and placeholder    |
| `--ring`             | Focus border and ring                    |
| `--destructive`      | Invalid border and ring                  |
| `--radius`           | Corners: 2.6 × `--radius` (pill) for one line, 1.4 × with a textarea, 1.8 × with block addons |

Buttons in the group use Button's tokens. See [Button.md](../Button/Button.md).

## Example

The `Playground` story, written out with its default controls:

```tsx
import { SearchIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "lab-package"

<InputGroup>
  <InputGroupAddon>
    <SearchIcon aria-hidden />
  </InputGroupAddon>
  <InputGroupInput aria-label="Search transactions" placeholder="Search" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton>Go</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```
