"use client"

import * as React from "react"

import { Button, type ButtonProps } from "../Button"
import { Input, type InputProps } from "../Input"
import { Textarea, type TextareaProps } from "../Textarea"
import { cn } from "../../lib/utils"

import styles from "./InputGroup.module.css"

export type InputGroupProps = React.ComponentProps<"div"> & {
  /** Dim the addons (pair with `disabled` on the control). */
  disabled?: boolean
}

function InputGroup({ className, disabled, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      role="group"
      data-disabled={disabled || undefined}
      // Marks the whole group inactive, so its dimmed addon text falls under
      // WCAG 1.4.3's exception for inactive components.
      aria-disabled={disabled || undefined}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export type InputGroupAddonAlign =
  "inline-start" | "inline-end" | "block-start" | "block-end"

export type InputGroupAddonProps = React.ComponentProps<"div"> & {
  /** Where the addon sits relative to the control. @default "inline-start" */
  align?: InputGroupAddonAlign
}

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(styles.addon, className)}
      onClick={(e) => {
        // Clicking an addon focuses the input, unless a button was clicked.
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

export type InputGroupButtonProps = Omit<ButtonProps, "size" | "type"> & {
  /** @default "xs" */
  size?: "xs" | "sm"
  type?: "button" | "submit" | "reset"
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      className={cn(styles.button, className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn(styles.text, className)} {...props} />
}

function InputGroupInput(props: InputProps) {
  return <Input data-slot="input-group-control" {...props} />
}

function InputGroupTextarea(props: TextareaProps) {
  return <Textarea data-slot="input-group-control" {...props} />
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
