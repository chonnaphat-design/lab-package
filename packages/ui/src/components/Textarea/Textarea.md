# Textarea

**Purpose:** A multi-line field for free text that can run longer than one line, such as a note, description or message.

## When to use

- Free text that may need several lines: a note to a recipient, a description of a problem, a message.

## When not to use

| Instead of a textarea for…                                       | Use                                         |
| ---------------------------------------------------------------- | ------------------------------------------- |
| A short single-line value, such as a name, phone number or amount | **Input**                                   |
| Structured answers, such as an address or a choice from options  | Separate Inputs, or a choice control. TODO: the package has no Select, Radio or Checkbox yet. |
| A message box with buttons attached, such as attach and send     | **InputGroup** with InputGroupTextarea      |
| Rich text with formatting                                        | TODO: the package has no rich-text editor.  |

GOV.UK also advises avoiding broad open-ended questions. Split them into specific questions where you can.

## Labels, hints and errors

Textarea is the field only. It has no built-in label, hint, error message or character count. Add them the same way as for [Input](../Input/Input.md):

- **Label:** always visible, above the field, with `<label htmlFor>` pointing at the textarea's `id`.
- **Hint:** one short sentence under the label, linked with `aria-describedby`. If there is a length limit, say it here, such as "Up to 500 characters".
- **Placeholder:** never instead of a label or hint. It disappears when the user types.
- **Error:** `invalid` turns the border red. Always add the message as text next to the field and link it with `aria-describedby`.

### Character limits

TODO: there is no character count component yet. If you need a limit:
- First check whether you need one at all. GOV.UK says to test without a limit first, and to raise a back-end limit rather than add a counter.
- Prefer a soft limit: let people type or paste past it, and show how many characters are over. GOV.UK does this; IBM Carbon instead blocks extra characters, so sources disagree. A hard `maxLength` cuts off pasted text without warning.
- Wording, from GOV.UK: "You have 20 characters remaining" and "You have 5 characters too many". When over the limit, show the error "Message must be 500 characters or less".
- Screen readers: announce the count in a polite status message, only after the user pauses typing, not on every keystroke.

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
import { Textarea } from "@chonny_iamsrithong/lab-package"

<label htmlFor="note">Note to recipient</label>
<Textarea id="note" rows={5} />
```

- Textarea has no `"use client"` of its own. Inside a form, read on submit, it works in a Server Component. If you pass `onChange` or control `value`, the file must start with `"use client"`.

## Props and variants

Textarea has **no `variant` or `size` props**. It is full width of its container, at least 64px tall (or `rows` lines), with 12px padding and 14px rounded corners. Text is 16px on screens narrower than 768px, so phones don't zoom in on focus, and 14px from 768px.

| Prop                 | Default | What it does                                                                     |
| -------------------- | ------- | -------------------------------------------------------------------------------- |
| `rows`               | none    | Starting height in lines, to hint at the answer length you expect. GOV.UK uses 5 by default and 8 for longer answers. |
| `invalid`            | `false` | Error state: red border and ring, and screen readers hear the field is invalid. Always pair it with an error message. |
| `disabled`           | `false` | Dims to 50% with a not-allowed cursor.                                           |
| `readOnly`           | `false` | Shown as plain text. It can still be focused, read and copied, but not changed.  |
| `placeholder`        | none    | Example text shown while empty, in a muted colour. It is not a label.            |
| `defaultValue`       | none    | Starting text.                                                                   |
| `value` + `onChange` | none    | Lets the app control the text.                                                   |
| `spellCheck`         | browser default | Browsers check spelling in textareas. Set `false` for codes or sensitive text, because some browsers send it to a spelling service. |
| `className`          | none    | For one-off layout tweaks.                                                       |

Other native textarea attributes, such as `name`, `required` and `aria-describedby`, also work.

### Height

- **Starts at `rows` lines**, or 64px when `rows` isn't set. Size it to the answer you expect, as GOV.UK, Microsoft Fluent and Apple advise: `rows={3}` is 86px tall, `rows={6}` is 146px.
- **Grows with its content** as the user types.
- **Stops growing** at about 17 lines (384px), or half the screen on smaller screens, then scrolls inside. That keeps the buttons below it on screen. Shopify Polaris, Atlassian and GitHub Primer do the same.
- **Older browsers** that can't grow the field with its content let users drag it taller instead. Growing with content needs Chrome 123, Safari 26.2 or Firefox 152.

People can't drag to resize it in current browsers, because it resizes itself.

### Keyboard

- **Enter** adds a new line. Don't make Enter submit a textarea; use a submit button. If you add a shortcut such as Ctrl/Cmd+Enter, keep the button too.
- **Tab** moves to the next field, as usual.

### States

| State     | How it is set   | Look                                                       |
| --------- | --------------- | ---------------------------------------------------------- |
| Empty     | No value        | Placeholder in the muted text colour                       |
| Focus     | Keyboard focus  | Dark grey border with a 3px soft ring                      |
| Invalid   | `invalid`       | Red border and a soft red ring                             |
| Disabled  | `disabled`      | 50% opacity, not-allowed cursor                            |
| Read-only | `readOnly`      | Plain text: no box or fill, normal cursor. Keyboard focus still shows the dark border. |

Read-only text looks like plain text, so users don't try to type in it. It stays focusable, so it can still be reached, read and copied.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

### Contrast

Same colours as Input. Typed text, placeholder, focus border and the red invalid border all pass. The field's outline is faint, at 1.23:1 against a white page, so keep a visible label on every textarea. TODO: decide whether to darken the `--input` border; see [Input.md](../Input/Input.md).

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
import { Textarea } from "@chonny_iamsrithong/lab-package"

<div className="grid gap-2">
  <label htmlFor="textarea-note" className="text-sm font-medium">
    Note to recipient
  </label>
  <Textarea id="textarea-note" placeholder="Add a note…" />
</div>
```
