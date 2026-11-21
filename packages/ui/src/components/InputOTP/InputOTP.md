# InputOTP

**Purpose:** A field for entering a short one-time code or PIN, showing one character per box.

## When to use

- A verification code sent by text message or email, usually 6 digits.
- A two-factor authentication code.
- A short PIN, such as 4 digits.

## When not to use

| Instead of an OTP input for…                         | Use                                     |
| ---------------------------------------------------- | --------------------------------------- |
| A password                                           | **Input** with `type="password"`        |
| Free text, or a value of unknown length              | **Input**                               |
| A long code, such as a licence key                   | TODO: no guidance yet on the longest code this should hold. |

## Anatomy

| Part                  | Role                                                              |
| --------------------- | ----------------------------------------------------------------- |
| **InputOTP**          | The field. Holds the value and receives typing and pasting.      |
| **InputOTPGroup**     | A run of joined boxes.                                            |
| **InputOTPSlot**      | One box, showing the character at its `index` (counting from 0). |
| **InputOTPSeparator** | A dash between two groups, such as in a 3 + 3 code.               |

Give every position from 0 to `maxLength − 1` exactly one slot.

## Props and variants

InputOTP has **no `variant` or `size` props**. Each box is 36 × 36px with 14px text. Boxes in a group are joined, and the group has pill-shaped ends.

### InputOTP

| Prop                 | Default         | What it does                                                                                     |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `maxLength`          | required        | The number of characters, which must equal the number of slots.                                  |
| `value` + `onChange` | none            | Lets the app control the value. The stories always use this.                                     |
| `onComplete`         | none            | Runs when the last box is filled, for example to submit the code.                                |
| `pattern`            | none            | A regular expression that typed or pasted text must match, such as `"^\\d+$"` for digits only. Other characters are rejected. |
| `disabled`           | `false`         | Dims the field to 50% and stops input.                                                           |
| `inputMode`          | `numeric`       | Which on-screen keyboard phones show. Set `"text"` for codes with letters.                       |
| `autoComplete`       | `one-time-code` | Lets phones offer the code from a text message.                                                  |
| `aria-label`         | none            | **Required when there is no visible label**, such as "Verification code".                        |

Pasting a whole code fills every box.

### InputOTPSlot

| Prop           | Default  | What it does                                                    |
| -------------- | -------- | --------------------------------------------------------------- |
| `index`        | required | Which character this box shows, counting from 0.                |
| `aria-invalid` | none     | Error state for this box. Set it on **every** slot to mark the code as wrong. |

TODO: InputOTP has no `invalid` prop, unlike Input and Textarea. Confirm whether it should get one.

### States

| State    | How it is set                 | Look                                                           |
| -------- | ----------------------------- | -------------------------------------------------------------- |
| Active   | The box the next character goes into | `--ring` border with a 3px soft ring. An empty active box shows a blinking caret. |
| Invalid  | `aria-invalid` on the slots   | Red borders, and a soft red ring around the group and active box |
| Disabled | `disabled`                    | The whole field at 50% opacity                                 |

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Tokens used

| Token           | Used for                                         |
| --------------- | ------------------------------------------------ |
| `--input`       | Box borders, and the fill at 30%                 |
| `--ring`        | Active box border and ring                       |
| `--destructive` | Invalid borders and rings                        |
| `--foreground`  | The blinking caret                               |
| `--radius`      | Group ends: 2.6 × `--radius`, a pill             |

Typed characters take the page's text colour.

## Example

The `Composition` story:

```tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "lab-package"

<InputOTP maxLength={6} aria-label="Verification code">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```
