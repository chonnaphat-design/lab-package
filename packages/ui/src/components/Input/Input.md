# Input

**Purpose:** A single-line field for typing a short value, such as a name, email, amount, password or search term.

## When to use

- Short free text on one line: name, email, amount, search term, URL, phone number, password.
- Picking a file to upload, with `type="file"`.

## When not to use

| Instead of an input for…                                         | Use                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| Text that can run to several lines, such as a note               | **Textarea**                                            |
| A field with an icon, fixed text or a button inside its border   | **InputGroup** with InputGroupInput                     |
| A one-time code or PIN, one character per box                    | **InputOTP**                                            |
| Choosing from a fixed list of options                            | TODO: the package has no Select, Radio or Checkbox yet. |
| A value the user can see but not change, and won't copy          | Plain text                                              |

## Labels, hints and errors

Input is the field only. It has no built-in label, hint or error message, so you add them around it. TODO: there is no Field component that wires these together yet.

- **Label: always visible, above the field.** Point a `<label htmlFor>` at the input's `id`. Use `aria-label` only when the purpose is obvious without words, such as a search field next to a search icon.
- **Hint:** one short sentence, such as "We'll only use this to send receipts". Put it under the label, give it an `id`, and point the input's `aria-describedby` at it.
- **Placeholder: never instead of a label or hint.** It disappears as soon as the user types. Use it only for an example of the format, or leave it out. Nielsen Norman Group, GOV.UK, IBM Carbon, Atlassian and Microsoft Fluent all agree.
- **Error:** setting `invalid` only turns the border red. It must always come with a text message that says what to do, such as "Enter an email address like name@acme.com". Avoid "invalid" and "please".
  - Put the message next to the field.
  - Add its `id` to the input's `aria-describedby`, so screen readers read it with the field.
  - Keep what the user typed; never clear the field.
- **When to check:** check when the form is submitted, or when the user leaves the field. Don't check while they are still typing. Sources disagree on which of the two; pick one for the whole product. TODO: decide.
- **Required or optional:** say it in the label text, such as "Phone (optional)". TODO: choose one convention for the product, either marking the optional fields or marking the required ones.

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
import { Input } from "@chonny_iamsrithong/lab-package"

<label htmlFor="email">Work email</label>
<Input id="email" type="email" autoComplete="email" spellCheck={false} />
```

- Input has no `"use client"` of its own. An input inside a form, read on submit, works in a Server Component. If you pass `onChange` or control `value`, the file must start with `"use client"`.

## Props and variants

Input has **no `variant` or `size` props**. Every input is 36px tall, the full width of its container, with 12px side padding and a pill shape. Text is 16px on screens narrower than 768px, which stops iPhones zooming in on focus, and 14px from 768px.

| Prop                 | Default | What it does                                                                     |
| -------------------- | ------- | -------------------------------------------------------------------------------- |
| `type`               | `text`  | The kind of value. See [Choosing the type](#choosing-the-type).                  |
| `invalid`            | `false` | Error state: red border and ring, and screen readers hear the field is invalid. Always pair it with an error message. |
| `disabled`           | `false` | Dims to 50% and can't be clicked or focused.                                     |
| `readOnly`           | `false` | The value can be selected and copied but not changed.                            |
| `placeholder`        | none    | Example text shown while empty, in a muted colour. It is not a label.            |
| `autoComplete`       | none    | Tells the browser what the field is for, such as `"email"` or `"name"`. See below. |
| `inputMode`          | none    | Which on-screen keyboard phones show, such as `"numeric"` or `"decimal"`.        |
| `defaultValue`       | none    | Starting value.                                                                  |
| `value` + `onChange` | none    | Lets the app control the value.                                                  |
| `className`          | none    | For one-off layout tweaks, such as a narrower width.                             |

Other native input attributes, such as `name`, `required`, `spellCheck` and `aria-describedby`, also work.

### Choosing the type

- **Email, phone, URL:** use `type="email"`, `"tel"` or `"url"`. Phones then show the right keyboard.
- **Numbers such as amounts or account numbers:** use `type="text"` with `inputMode="decimal"` or `"numeric"`. GOV.UK advises against `type="number"`: it adds step arrows, mangles long numbers and drops leading zeros. The `Types` story shows `type="number"`, but prefer `inputMode`.
- **Personal details:** set `autoComplete` on fields that ask about the user, such as name, email, phone, address or card. WCAG 1.3.5 requires it. Don't make users type the same thing twice in one flow (WCAG 3.3.7).
- **Names, emails and reference numbers:** set `spellCheck={false}`.

### Width

The input fills its container. Where the expected value is short, such as a postcode, a card's security code or a year, make it narrower so its size hints at the length. People make more mistakes when they can't see their whole entry. TODO: there are no width options yet; use `className`.

### States

| State     | How it is set   | Look                                                       |
| --------- | --------------- | ---------------------------------------------------------- |
| Empty     | No value        | Placeholder in the muted text colour                       |
| Focus     | Keyboard focus  | Dark grey border with a 3px soft ring                      |
| Invalid   | `invalid`       | Red border and a soft red ring                             |
| Disabled  | `disabled`      | 50% opacity, not-allowed cursor, skipped by Tab            |
| Read-only | `readOnly`      | Plain text: no box or fill, normal cursor. Keyboard focus still shows the dark border. |

**Read-only** fields look like plain text, so users don't try to type in them. IBM Carbon and Shopify Polaris both give read-only fields a look of their own. They stay focusable, so keyboard and screen-reader users can still reach, read and copy the value. Inside an InputGroup, the group keeps its box, which suits a copy-link field.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

### Contrast

Measured on the real inputs:

| What                          | Light | Dark  | Needs |
| ----------------------------- | ----- | ----- | ----- |
| Typed text                    | 18.43 | 17.34 | 4.5   |
| Placeholder                   | 4.96  | 7.73  | 4.5   |
| Focus border against the page | 5.25  | 4.60  | 3     |
| Field border against the page | 1.23  | 1.48  | 3, see below |
| Invalid border against the page | 7.19 | 6.78 | 3     |

- **The field's outline is very faint.** WCAG 1.4.11 asks for 3:1 on whatever shows that a field is there. A visible label next to the field may count as that cue; the WCAG guidance is ambiguous. Keep a visible label on every input. TODO: decide whether to darken the `--input` border, which affects every field.
- **The red border is never the only error cue.** Always add the error message as text.

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
import { Input } from "@chonny_iamsrithong/lab-package"

<div className="grid gap-2">
  <label htmlFor="input-email" className="text-sm font-medium">
    Work email
  </label>
  <Input id="input-email" type="email" placeholder="name@acme.com" />
</div>
```

Here the placeholder shows the format, and the label carries the meaning. In a real form, also set `autoComplete="email"` and `spellCheck={false}`.
