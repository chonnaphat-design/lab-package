import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "../../lib/utils"

import styles from "./Badge.module.css"

export type BadgeVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "link"

export type BadgeProps = useRender.ComponentProps<"span"> & {
  /** Visual style. @default "primary" */
  variant?: BadgeVariant
}

function Badge({
  className,
  variant = "primary",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: cn(styles.root, className) }, props),
    render,
    // State is emitted as data-slot / data-variant attributes.
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge }
