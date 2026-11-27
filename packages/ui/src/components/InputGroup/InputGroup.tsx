"use client"

import * as React from "react"

import { Button, type ButtonProps } from "../Button"
import { Input, type InputProps } from "../Input"
import { Textarea, type TextareaProps } from "../Textarea"
import { cn } from "../../lib/utils"

import styles from "./InputGroup.module.css"

/** Lets the group's `disabled` reach the control and buttons inside it. */
const InputGroupContext = React.createContext({ disabled: false })

export type InputGroupProps = React.ComponentProps<"div"> & {
  /** Disable the control and every button inside, and dim the addons. */
  disabled?: boolean
}

function InputGroup({ className, disabled = false, ...props }: InputGroupProps) {
  const context = React.useMemo(() => ({ disabled }), [disabled])
  return (
    <InputGroupContext.Provider value={context}>
      <div
        data-slot="input-group"
        role="group"
        data-disabled={disabled || undefined}
        // Marks the whole group inactive, so its dimmed addon text falls under
        // WCAG 1.4.3's exception for inactive components. True now that the
        // controls inside are disabled too.
        aria-disabled={disabled || undefined}
        className={cn(styles.root, className)}
        {...props}
      />
    </InputGroupContext.Provider>
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
    // No role: addons are layout, and an unnamed "group" per addon is noise for screen readers.
    <div
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
  disabled,
  ...props
}: InputGroupButtonProps) {
  const group = React.useContext(InputGroupContext)
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled ?? group.disabled}
      className={cn(styles.button, className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn(styles.text, className)} {...props} />
}

function InputGroupInput({ disabled, ...props }: InputProps) {
  const group = React.useContext(InputGroupContext)
  return (
    <Input
      data-slot="input-group-control"
      disabled={disabled ?? group.disabled}
      {...props}
    />
  )
}

function InputGroupTextarea({ disabled, ...props }: TextareaProps) {
  const group = React.useContext(InputGroupContext)
  return (
    <Textarea
      data-slot="input-group-control"
      disabled={disabled ?? group.disabled}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
