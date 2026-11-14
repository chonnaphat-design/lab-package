import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "../../lib/utils"

import styles from "./Button.module.css"

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "link"

export type ButtonSize = "xs" | "sm" | "md" | "lg"

export type ButtonProps = ButtonPrimitive.Props & {
  /** Visual style. @default "primary" */
  variant?: ButtonVariant
  /** Height and padding scale. @default "md" */
  size?: ButtonSize
  /** Square button sized for a single icon (pair with an aria-label). */
  iconOnly?: boolean
}

function Button({
  className,
  variant = "primary",
  size = "md",
  iconOnly = false,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Button }
