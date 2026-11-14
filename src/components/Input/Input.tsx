import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "../../lib/utils"

import styles from "./Input.module.css"

export type InputProps = React.ComponentProps<"input"> & {
  /** Show the error state (sets aria-invalid). */
  invalid?: boolean
}

function Input({ className, type, invalid, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      aria-invalid={invalid || undefined}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Input }
