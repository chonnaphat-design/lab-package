import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./InputOTP"

type OTPDemoProps = {
  /** Number of slots. */
  length?: 4 | 6
  /** Starting value. */
  initialValue?: string
  /** Show the error state on every slot. */
  invalid?: boolean
  disabled?: boolean
  /** Split six slots into two groups of three. */
  withSeparator?: boolean
  /** Accept digits only. */
  digitsOnly?: boolean
  label?: string
}

/** Controlled wrapper so stories can be typed in and keep their value. */
function OTPDemo({
  length = 6,
  initialValue = "",
  invalid = false,
  disabled = false,
  withSeparator = true,
  digitsOnly = true,
  label = "One-time code",
}: OTPDemoProps) {
  const [value, setValue] = React.useState(initialValue)
  const slot = (index: number) => (
    <InputOTPSlot key={index} index={index} />
  )
  const split = withSeparator && length === 6

  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={setValue}
      disabled={disabled}
      invalid={invalid}
      pattern={digitsOnly ? REGEXP_ONLY_DIGITS : undefined}
      aria-label={label}
    >
      {split ? (
        <>
          <InputOTPGroup>{[0, 1, 2].map(slot)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{[3, 4, 5].map(slot)}</InputOTPGroup>
        </>
      ) : (
        <InputOTPGroup>{Array.from({ length }, (_, i) => slot(i))}</InputOTPGroup>
      )}
    </InputOTP>
  )
}

const meta = {
  title: "Components/InputOTP",
  component: OTPDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One-time-code input built on `input-otp`. Compose `InputOTP` → `InputOTPGroup` → `InputOTPSlot index={n}`, with optional `InputOTPSeparator`. These stories use a small controlled wrapper (`OTPDemo`) so the controls below drive the real parts.",
      },
    },
  },
  args: {
    length: 6,
    initialValue: "",
    invalid: false,
    disabled: false,
    withSeparator: true,
    digitsOnly: true,
    label: "One-time code",
  },
  argTypes: {
    length: { control: "inline-radio", options: [4, 6] },
  },
} satisfies Meta<typeof OTPDemo>

export default meta
type Story = StoryObj<typeof meta>

/** Click and type, or paste a code such as "428 193": spaces and dashes are stripped. */
export const Playground: Story = {}

/** Partly filled: the next slot shows the blinking caret when the field has focus. */
export const PartlyFilled: Story = {
  args: { initialValue: "42" },
}

export const Filled: Story = {
  args: { initialValue: "428193" },
}

/** `invalid` marks the field invalid for screen readers and turns every slot red. */
export const Invalid: Story = {
  args: { initialValue: "428", invalid: true },
}

export const Disabled: Story = {
  args: { initialValue: "4281", disabled: true },
}

export const FourDigits: Story = {
  args: { length: 4, withSeparator: false, label: "PIN" },
}

/** The same input under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  args: { initialValue: "42" },
  decorators: [
    (Story) => (
      <div className="dark rounded-2xl bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
}

/** The parts written out, as an app would use them. */
export const Composition: Story = {
  render: () => (
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
  ),
}
