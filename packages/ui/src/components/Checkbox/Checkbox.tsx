"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"

import { cn } from "../../lib/utils"

import styles from "./Checkbox.module.css"

export type CheckboxProps = CheckboxPrimitive.Root.Props & {
  /** Error state: red border and ring, and screen readers hear it is invalid. */
  invalid?: boolean
}

/** A box the user ticks to turn one option on or off. Pair it with a label. */
function Checkbox({ className, invalid, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      aria-invalid={invalid || undefined}
      className={cn(styles.root, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={styles.indicator}
      >
        {/* shadcn shows a tick for "partly checked" too; show a dash instead. */}
        <CheckIcon className={styles.checkIcon} />
        <MinusIcon className={styles.indeterminateIcon} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
