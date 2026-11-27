"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { LoaderCircleIcon } from "lucide-react"

import { Button, type ButtonProps } from "../Button"
import { cn } from "../../lib/utils"

import styles from "./AlertDialog.module.css"

type AlertDialogContextValue = {
  /** True while an async action is running. */
  pending: boolean
  setPending: (pending: boolean) => void
  close: () => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null,
)

/**
 * A dialog that needs an answer. Always modal; a click on the backdrop
 * never closes it (Esc and Cancel still do). Announced as `role="alertdialog"`.
 * While an async action is pending, nothing closes it.
 */
function AlertDialog({
  actionsRef: actionsRefProp,
  onOpenChange,
  ...props
}: AlertDialogPrimitive.Root.Props) {
  const ownActionsRef = React.useRef<AlertDialogPrimitive.Root.Actions | null>(
    null,
  )
  const actionsRef = actionsRefProp ?? ownActionsRef
  const [pending, setPendingState] = React.useState(false)
  // Read synchronously in onOpenChange, before the state update lands.
  const pendingRef = React.useRef(false)

  const context = React.useMemo<AlertDialogContextValue>(
    () => ({
      pending,
      setPending(next) {
        pendingRef.current = next
        setPendingState(next)
      },
      close() {
        actionsRef.current?.close()
      },
    }),
    [pending, actionsRef],
  )

  return (
    <AlertDialogContext.Provider value={context}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        actionsRef={actionsRef}
        onOpenChange={(open, eventDetails) => {
          // Esc, Cancel or anything else can't abandon an action mid-flight.
          if (!open && pendingRef.current) {
            eventDetails.cancel()
            return
          }
          onOpenChange?.(open, eventDetails)
        }}
        {...props}
      />
    </AlertDialogContext.Provider>
  )
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(styles.overlay, className)}
      {...props}
    />
  )
}

export type AlertDialogContentProps = AlertDialogPrimitive.Popup.Props

/** The panel. No × button: the user answers with Cancel or the action. */
function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(styles.content, className)}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(styles.header, className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(styles.footer, className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(styles.title, className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(styles.description, className)}
      {...props}
    />
  )
}

type ButtonClickEvent = Parameters<NonNullable<ButtonProps["onClick"]>>[0]

export type AlertDialogActionProps = Omit<ButtonProps, "onClick" | "iconOnly"> & {
  /**
   * Runs the action. Return a promise to keep the dialog open while it runs:
   * it closes when the promise resolves and stays open if it rejects.
   */
  onClick?: (event: ButtonClickEvent) => void | Promise<unknown>
}

/** The confirming button. Closes the dialog after `onClick`, or after its promise resolves. */
function AlertDialogAction({
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  children,
  ...props
}: AlertDialogActionProps) {
  const context = React.useContext(AlertDialogContext)
  const pending = context?.pending ?? false

  function handleClick(event: ButtonClickEvent) {
    const result = onClick?.(event)
    if (!context) return
    if (result && typeof result.then === "function") {
      context.setPending(true)
      result.then(
        () => {
          context.setPending(false)
          context.close()
        },
        // Rejected: stay open so the caller can show the error and the user can retry.
        () => context.setPending(false),
      )
      return
    }
    context.close()
  }

  return (
    <Button
      data-slot="alert-dialog-action"
      variant={variant}
      size={size}
      // Disabled while pending, but it keeps focus so focus doesn't fall to <body>.
      disabled={disabled || pending}
      focusableWhenDisabled
      aria-busy={pending || undefined}
      onClick={handleClick}
      {...props}
    >
      {pending && (
        <LoaderCircleIcon
          data-icon="inline-start"
          aria-hidden
          className={styles.spinner}
        />
      )}
      {children}
    </Button>
  )
}

export type AlertDialogCancelProps = AlertDialogPrimitive.Close.Props &
  Pick<ButtonProps, "variant" | "size">

/**
 * The safe way out. Put it first in the footer so it gets focus on open.
 * Disabled while an async action is pending.
 */
function AlertDialogCancel({
  variant = "outline",
  size = "md",
  disabled,
  ...props
}: AlertDialogCancelProps) {
  const pending = React.useContext(AlertDialogContext)?.pending ?? false
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={<Button variant={variant} size={size} />}
      disabled={disabled || pending}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
