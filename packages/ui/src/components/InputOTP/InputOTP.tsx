"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "../../lib/utils"

import styles from "./InputOTP.module.css"

/** Lets `invalid` on InputOTP reach every slot. */
const InputOTPInvalidContext = React.createContext(false)

/**
 * Codes copied from messages often contain spaces or dashes ("428 193", "428-193").
 * Strip them before the pattern check, so a paste isn't silently rejected.
 */
function stripSeparators(text: string) {
  return text.replace(/[\s\u2010-\u2015-]/g, "")
}

export type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  /** Class for the wrapper around the slots (className styles the hidden input). */
  containerClassName?: string
  /** Error state: marks the field invalid for screen readers and draws every slot in red. */
  invalid?: boolean
}

function InputOTP({
  className,
  containerClassName,
  invalid = false,
  pasteTransformer = stripSeparators,
  ...props
}: InputOTPProps) {
  return (
    <InputOTPInvalidContext.Provider value={invalid}>
      <OTPInput
        data-slot="input-otp"
        containerClassName={cn(styles.container, containerClassName)}
        spellCheck={false}
        className={cn(styles.input, className)}
        aria-invalid={invalid || undefined}
        pasteTransformer={pasteTransformer}
        {...props}
      />
    </InputOTPInvalidContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(styles.group, className)}
      {...props}
    />
  )
}

export type InputOTPSlotProps = React.ComponentProps<"div"> & {
  /** Position of the character this slot shows. */
  index: number
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const invalid = React.useContext(InputOTPInvalidContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      aria-invalid={invalid || undefined}
      className={cn(styles.slot, className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className={styles.caret}>
          <div className={styles.caretBar} />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    // Decorative: the real field holds the value, so screen readers skip the dash.
    <div
      data-slot="input-otp-separator"
      aria-hidden="true"
      className={cn(styles.separator, className)}
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
