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
| A unit the user chooses, such as a currency picker           | TODO: the package has no Select yet.                         |
| A symbol people might not recognise                          | Say it in the label instead, such as "Weight, in kilograms". |
| Three or more buttons, or a long suffix on a narrow screen   | Fewer attachments. They squeeze the space left for typing.   |
| Help text or an error message under the field                | TODO: the package has no field-description or error-message component yet. |

Atlassian advises against putting buttons inside text fields at all, while GitHub Primer, Shopify Polaris, Material and Microsoft Fluent allow one trailing action. Keep it to one or two small buttons.

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

## Making it make sense to screen readers

Screen readers announce the control's label, not what sits around it. Fixed text and icons in addons are **not** connected to the field on their own.

- **Label the control.** Use a visible `<label htmlFor>` pointing at the input's `id`, or `aria-label` when there's no room for one, such as a search field. An icon in an addon is never a label.
- **Fixed text that matters must reach the field.** In the `WithText` story, screen readers hear "Work email" but never "@acme.com". Choose one way:
  - put the meaning in the label, such as "Amount, in US dollars" or "Work email, ending @acme.com". GOV.UK does this, and hides the symbol from screen readers;
  - or give the InputGroupText an `id` and add it to the input's `aria-describedby`, as Bootstrap does.
- **Icons are decoration.** Hide them from screen readers with `aria-hidden`, as the stories do.
- **A search icon doesn't search.** Users expect clicking a magnifying glass to run the search. Pair it with a labelled button, as the `Playground` story does with "Go", and let Enter submit too.

TODO: decide one rule for fixed text across the product, either in the label or linked with `aria-describedby`.

## Import and use

Install the package, then import its stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install lab-package
```

```tsx
import "lab-package/styles.css"
```

Then import the component where you use it:

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "lab-package"

<InputGroup>
  <InputGroupAddon>
    <InputGroupText>$</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput aria-label="Amount, in US dollars" inputMode="decimal" />
</InputGroup>
```

- Import only the parts you use.
- InputGroup ships with `"use client"`, so you can render it from a Server Component. A file that passes a function, such as `onClick` on InputGroupButton, must start with `"use client"`.
- Icons in the stories come from `lucide-react`. Install it in your app to use them: `npm install lucide-react`.

## Props and variants

InputGroup has **no `variant` or `size` props**. A single-line group is 36px tall with a pill shape. With a textarea it grows with the text and has 14px corners. With an addon above or below, it stacks and has 18px corners.

### InputGroup

| Prop       | Default | What it does                                                                                                    |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `disabled` | `false` | Disables the control and every button inside, dims the addons to 50%, and tells screen readers the group is disabled. |

A control or button can still override it with its own `disabled`.

### InputGroupAddon

| Prop    | Default        | What it does                                                         |
| ------- | -------------- | -------------------------------------------------------------------- |
| `align` | `inline-start` | `inline-start`: before the control. `inline-end`: after it. `block-start`: above it, full width. `block-end`: below it, full width. |

Clicking an addon outside its buttons moves focus to the input. That helps, because GOV.UK found people click on prefixes. TODO: with a textarea, clicking an addon does not move focus. Confirm whether it should.

TODO: the stories draw a divider between a block addon and the textarea with a class, not a prop. Decide whether it should become a prop.

### InputGroupButton

| Prop       | Default  | What it does                                                         |
| ---------- | -------- | -------------------------------------------------------------------- |
| `variant`  | `ghost`  | Any Button variant. The stories use `ghost`, `secondary` and `primary`. |
| `size`     | `xs`     | `xs` (24px) or `sm` (32px). Larger sizes don't fit the group.        |
| `iconOnly` | `false`  | A square icon button. **Always add `aria-label`** naming the action, such as "Copy link". |
| `type`     | `button` | Set `type="submit"` only if it submits the form.                     |
| `disabled` | `false`  | Disables the button.                                                 |

- **Size:** `xs` is exactly WCAG's 24px minimum target, so leave space between `xs` buttons. Prefer `sm` on touch screens.
- **Copy buttons:** confirm the copy with a message screen readers announce, such as "Link copied" in a status message. TODO: there is no pattern for this yet.
- **Show/hide password:** change the button's label between "Show password" and "Hide password", and announce the change. TODO: there is no story or pattern for this yet.

### InputGroupInput and InputGroupTextarea

They take the same props as [Input](../Input/Input.md) and [Textarea](../Textarea/Textarea.md), including `invalid`, `disabled`, `readOnly` and `placeholder`. Their own border, fill and ring are removed: the group draws them. A read-only control in a group keeps the group's box, which suits a copy-link field.

### Message box with a toolbar

The `WithTextarea` story is a message composer, with a header above it and attach and send buttons below.
- Label the textarea itself; a header above it isn't a label on its own. The story uses `aria-label`.
- Give both icon buttons an `aria-label`.
- TODO: there is no rule yet for whether Enter sends and Shift+Enter starts a new line. No standard covers it. If Enter sends, it must not fire while the user is still composing in a Japanese, Chinese or Korean keyboard.

### States

| State    | How it is set                      | Look                                                     |
| -------- | ---------------------------------- | -------------------------------------------------------- |
| Focus    | Keyboard focus on the control      | The whole group gets the dark focus border and 3px soft ring |
| Invalid  | `invalid` on the control           | The whole group gets a red border and soft red ring      |
| Disabled | `disabled` on the group            | Addons at 50%; control and buttons at 50% and not usable |

- **Invalid:** a red border isn't enough on its own. Add an error message as text, and link it with the control's `aria-describedby`. See [Input.md](../Input/Input.md).
- **Disabled:** the dimmed addon text is below 4.5:1 contrast on purpose. WCAG doesn't require contrast for disabled controls, and full contrast would make it look enabled.
- **Faint outline:** the group's border is 1.23:1 against a white page. With a visible label that's acceptable; without one, as in a search field labelled only by `aria-label`, it may fail WCAG 1.4.11. Keep a visible label where you can. TODO: decide whether to darken the `--input` border.

Screen readers treat the whole InputGroup as one group. Addons don't add groups of their own. You can name the group with `aria-label` when it holds more than one meaning, but usually the control's label is enough.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

### Contrast

| What                          | Light | Dark | Needs |
| ----------------------------- | ----- | ---- | ----- |
| Addon text and icons          | 4.96  | 7.73 | 4.5   |
| Focus border against the page | 5.25  | 4.60 | 3     |
| Group border against the page | 1.23  | 1.48 | 3, see above |

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

The icon is hidden from screen readers, the field has a label, and "Go" runs the search.
