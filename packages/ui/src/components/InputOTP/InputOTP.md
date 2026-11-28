# InputOTP

**Purpose:** A field for entering a short one-time code, such as a verification code sent by text message, shown one character per box.

## When to use

- A verification code sent by text message or email, usually 6 digits.
- A two-factor authentication code from an authenticator app.

## When not to use

| Instead of an OTP input for…                                  | Use                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| A password                                                    | **Input** with `type="password"`                        |
| A recurring secret PIN that should be hidden while typing     | TODO: no masked mode. InputOTP always shows the characters. |
| Free text, or a value of unknown length                       | **Input**                                               |
| A long code, such as a 16-character access or licence key     | **Input**, with the format described in the label       |

**Boxes or one field?** GOV.UK, Google Chrome's guidance and Twilio all recommend one plain text field for codes. Separate boxes per digit often break paste, autofill and screen readers. InputOTP avoids those problems: behind the boxes is **one real field**, with one label and one Tab stop, and paste and autofill fill it in one go. An **Input** with a clear label is still a valid, simpler choice.

## Anatomy

| Part                  | Role                                                              |
| --------------------- | ----------------------------------------------------------------- |
| **InputOTP**          | The real field. Holds the value, the label and any error state, and receives typing, pasting and autofill. |
| **InputOTPGroup**     | A run of joined boxes.                                            |
| **InputOTPSlot**      | One box, showing the character at its `index` (counting from 0). It is only a picture. |
| **InputOTPSeparator** | A dash between two groups, such as in a 3 + 3 code. It is only visual and isn't part of the value. |

Give every position from 0 to `maxLength − 1` exactly one slot.

## Labels, hints and errors

InputOTP has no built-in label, hint or error message, so you add them around it.

- **Label it**, with a visible label such as "Security code" pointed at the field, or `aria-label` on InputOTP.
- **Hint:** say where the code was sent and how long it is, such as "Enter the 6-digit code from the text message we just sent". Link it with `aria-describedby` on InputOTP. Sources disagree on showing the phone number or email. GOV.UK avoids it at sign-in, and Visa avoids it entirely.
- **Error:** set `invalid` on InputOTP. Screen readers then hear that the code is wrong, and every box turns red. Add the message as text, linked with `aria-describedby`. GOV.UK's wording:
  - "Enter a correct security code";
  - "The security code has expired. We've sent you a new code";
  - "You've not entered enough numbers. The code must be 6 numbers".
- **Expiry and resend:** tell users how long the code lasts, and offer a way to get a new one, such as "Not received a text message?" with a note that messages can take a few minutes. TODO: there is no resend or timer pattern in the package yet.

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
"use client"

import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@chonny_iamsrithong/lab-package"

export function SecurityCode() {
  const [code, setCode] = useState("")
  return (
    <InputOTP
      maxLength={6}
      value={code}
      onChange={setCode}
      pattern="^\d+$"
      aria-label="Security code"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

- Import only the parts you use; add `InputOTPSeparator` for a 3 + 3 layout.
- InputOTP ships with `"use client"`. In practice you control its value or use `onComplete`, so the file that renders it starts with `"use client"` too, as above.

## Props and variants

InputOTP has **no `variant` or `size` props**. Each box is 36 × 36px with 14px text. Boxes in a group are joined, and the group has pill-shaped ends. The whole row is one tap target, so it's well above the 24px minimum, and phones don't zoom in on focus.

### InputOTP

| Prop                 | Default         | What it does                                                                                     |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `maxLength`          | required        | The number of characters, which must equal the number of slots. Six is the common length.       |
| `value` + `onChange` | none            | Lets the app control the value. The stories always use this.                                     |
| `onComplete`         | none            | Runs when the last box is filled. See [Submitting](#submitting).                                 |
| `pattern`            | none            | A regular expression the whole value must match: `"^\\d+$"` for digits, `"^[a-zA-Z0-9]+$"` for letters and digits. Anything else is rejected. |
| `invalid`            | `false`         | Error state: tells screen readers the code is wrong and turns every box red. Pair it with an error message. |
| `pasteTransformer`   | strips spaces and dashes | Cleans pasted text before it's checked. See [Paste](#paste). Pass your own to change it. |
| `disabled`           | `false`         | Dims the field to 50% and stops input.                                                           |
| `inputMode`          | `numeric`       | Which on-screen keyboard phones show. Set `"text"` for codes with letters.                       |
| `autoComplete`       | `one-time-code` | Lets phones offer the code from a text message. Keep it.                                         |
| `aria-label`         | none            | **Required when there is no visible label**, such as "Security code".                            |
| `aria-describedby`   | none            | Links the hint and error message to the field.                                                   |

### InputOTPSlot

| Prop           | Default  | What it does                                                    |
| -------------- | -------- | --------------------------------------------------------------- |
| `index`        | required | Which character this box shows, counting from 0.                |
| `aria-invalid` | none     | Draws only this box in the error style. Usually use `invalid` on InputOTP instead. |

### Paste

Pasting a whole code fills every box. Users must always be able to paste or autofill a code; WCAG 3.3.8 requires it.

Codes copied from messages often contain spaces or dashes. InputOTP removes them from pasted text before checking `pattern`, as GOV.UK recommends. So "428 193", "428-193", "428–193" and " 428193 " all become 428193. Characters the `pattern` doesn't allow, such as letters in a digits-only code, still reject the whole paste.

### Submitting

`onComplete` can submit the code as soon as the last box is filled. That's quick, but a typo or a wrong paste is submitted at once, using up an attempt. WCAG 3.2.2 doesn't allow an unexpected change. Either keep a visible "Continue" button, or tell users beforehand that the code submits automatically. TODO: decide the product rule.

### Text-message autofill

For iPhones to offer the code from a text message, end the message with a line like `@example.com #123456`, using your site's domain. Chrome can also read the code with the WebOTP browser API. Both are set up by the app and the message sender, not this component.

### States

| State    | How it is set                 | Look                                                           |
| -------- | ----------------------------- | -------------------------------------------------------------- |
| Active   | The box the next character goes into | Dark focus border with a 3px soft ring. An empty active box shows a blinking caret. |
| Invalid  | `invalid`                     | Red borders, and a soft red ring around the group and active box |
| Disabled | `disabled`                    | The whole field at 50% opacity                                 |

Dark mode is applied automatically when a `.dark` class is set on a parent element.

Screen readers hear one field with its label and value. The boxes and the dash between groups are hidden from them.

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
} from "@chonny_iamsrithong/lab-package"

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

In a real form, add a visible label and hint, a digits-only `pattern`, and a Continue button.
