# Checkbox

**Purpose:** A box the user ticks to turn one option on, or to pick any number of options from a list.

## When to use

- **One opt-in,** such as "Email me my monthly statement", unticked by default.
- **Any number of independent options** from a short list, such as which notifications to receive.
- **"Select all"** above a list, partly ticked while only some are.

The choice applies when the form is submitted.

## When not to use

| Instead of a checkbox for…                                      | Use                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| Exactly one choice from several                                 | Radio buttons. TODO: the package has no Radio yet.     |
| A setting that takes effect immediately, such as dark mode      | A switch. TODO: the package has no Switch yet.         |
| More than about seven options                                   | Split the list, or a searchable list. TODO: no combobox yet. |
| A statement the user must agree to, phrased as a negative       | A positive statement, so ticked always means yes.      |

## Writing the label

- **Positive and short,** such as "Email me my monthly statement". Avoid negatives like "Don't email me": ticked should always mean yes.
- **The whole label is clickable.** Wrap the checkbox in a `label`, or point a `label`'s `htmlFor` at the checkbox's `id`.
- **The box goes before the label,** on the left. That helps people using screen magnifiers.
- **Groups ask a question,** such as "Which notifications do you want?". Put it in a `fieldset`'s `legend`. Add a hint such as "Select all that apply". Don't pre-tick options.
- **Long lists:** stack options vertically. If needed, add a last option "None of these", after an "or" divider, that clears the others.

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
import { Checkbox } from "lab-package"

<label className="flex items-center gap-3">
  <Checkbox name="statement" />
  Email me my monthly statement
</label>
```

- Checkbox ships with `"use client"`, so you can render it from a Server Component. Reading its value with `checked` and `onCheckedChange` needs a file that starts with `"use client"`.
- In a form, give it a `name`. The ticked value is submitted with the form.

## Props and variants

Checkbox has **no `variant` or `size` props**. The box is 16 × 16px with 6px corners. An invisible hit area around it makes the click target about 40 × 32px, above the 24px minimum, and the label adds more.

| Prop                         | Default | What it does                                                                     |
| ---------------------------- | ------- | -------------------------------------------------------------------------------- |
| `defaultChecked`             | `false` | Starts ticked.                                                                   |
| `checked` + `onCheckedChange` | none   | Lets the app control whether it's ticked.                                        |
| `indeterminate`              | `false` | Partly ticked: shows a dash, and screen readers hear "mixed". Use it on a "Select all" whose options are only partly ticked; see the `SelectAll` story. |
| `invalid`                    | `false` | Error state: red border and ring, and screen readers hear it is invalid. Always pair it with an error message. |
| `disabled`                   | `false` | Dims to 50% and can't be changed. See below.                                     |
| `readOnly`                   | `false` | Can be focused and read, but not changed. TODO: it has no look of its own yet.   |
| `required`                   | `false` | The form can't be submitted until it's ticked.                                   |
| `name`, `value`              | none    | The field name, and the value submitted when ticked.                             |
| `id`                         | none    | The id a `label`'s `htmlFor` points at.                                          |
| `className`                  | none    | For one-off tweaks.                                                              |

### Errors

- **A red border isn't enough.** Add an error message in text, such as "Select at least one notification".
- **For a group, show the error once,** on the group: inside the `fieldset`, after the hint. Link it with the `fieldset`'s `aria-describedby`, rather than marking every box invalid.

### Disabled and read-only

Avoid disabled checkboxes where you can. Screen-reader users can't reach them to find out why they can't be changed, and Atlassian suggests keeping the checkbox usable and explaining in a message instead.

Use `readOnly` for a value people can see but not change, such as one set by an administrator. It stays reachable by keyboard. Use `disabled` only for something temporarily unavailable until the user does something else.

### Select all

A "Select all" checkbox ticks every option when clicked, and clears them all when clicked again. While only some are ticked, set `indeterminate` on it. Indent the options under it, as the `SelectAll` story does.

### States

| State         | How it is set     | Look                                                       |
| ------------- | ----------------- | ---------------------------------------------------------- |
| Unticked      | default           | Grey border                                                 |
| Ticked        | clicked, or `checked` | Lime fill with a dark tick and a dark border (lime border in dark mode) |
| Partly ticked | `indeterminate`   | Lime fill with a dark dash                                  |
| Focus         | keyboard focus    | Dark grey border and a 3px soft ring, in every state        |
| Invalid       | `invalid`         | Red border and soft red ring                                |
| Disabled      | `disabled`        | 50% opacity, not-allowed cursor                             |

Dark mode is applied automatically when a `.dark` class is set on a parent element. Unticked boxes get a faint fill there.

## Contrast

| What                               | Light | Dark  | Needs |
| ---------------------------------- | ----- | ----- | ----- |
| Unticked border against the page   | 5.27  | 8.43  | 3     |
| Ticked box's border against the page | 8.77 | 10.06 | 3     |
| Tick or dash on the lime fill      | 5.72  | 4.50  | 3     |
| Focus border against the page      | 5.25  | 4.60  | 3     |
| Invalid border against the page    | 7.19  | 6.78  | 3     |

shadcn's unticked border used `--input`, only 1.23:1 against the page. For a checkbox that border is the only sign the control is there, so WCAG 1.4.11 requires 3:1. We use `--muted-foreground` instead. We also give ticked boxes a dark border in light mode, because the lime fill alone is 1.53:1 against white. axe (WCAG 2.2 AA) passes every story.

## Tokens used

| Token                  | Used for                                                  |
| ---------------------- | --------------------------------------------------------- |
| `--muted-foreground`   | Unticked border                                           |
| `--primary`            | Ticked and partly ticked fill, and the border in dark mode |
| `--primary-foreground` | The tick and dash, and the ticked border in light mode     |
| `--input`              | The faint fill of an unticked box in dark mode, at 30%    |
| `--ring`               | Focus border and ring                                     |
| `--destructive`        | Invalid border and ring                                   |

## Example

The `Group` story:

```tsx
import { Checkbox } from "lab-package"

<fieldset className="grid gap-3">
  <legend className="mb-1 font-medium">Which notifications do you want?</legend>
  <label className="flex items-center gap-3">
    <Checkbox name="notifications" value="Payments received" />
    Payments received
  </label>
  <label className="flex items-center gap-3">
    <Checkbox name="notifications" value="Bills due" />
    Bills due
  </label>
  <label className="flex items-center gap-3">
    <Checkbox name="notifications" value="Security alerts" defaultChecked />
    Security alerts
  </label>
</fieldset>
```
