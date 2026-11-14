import * as React from "react"

import { cn } from "../../lib/utils"

import styles from "./Textarea.module.css"

export type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Show the error state (sets aria-invalid). */
  invalid?: boolean
}

function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={invalid || undefined}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Textarea }
