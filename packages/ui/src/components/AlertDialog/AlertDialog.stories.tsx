import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "../Button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog"

/** Open alert dialogs are modal and fixed to the viewport, so docs show them in their own iframe. */
const ownFrame = { docs: { story: { inline: false, iframeHeight: 360 } } }

/** AlertDialogContent portals to <body>, so dark mode goes on <html> like a theme switcher would. */
const withDarkHtml: Decorator = (Story) => {
  React.useEffect(() => {
    const html = document.documentElement
    html.classList.add("dark")
    return () => html.classList.remove("dark")
  }, [])
  return <Story />
}

type ConfirmProps = {
  /** Start open. */
  defaultOpen?: boolean
  /** `danger` for actions that can't be undone, `primary` otherwise. */
  actionVariant?: "primary" | "danger"
  triggerLabel?: string
  title?: string
  description?: string
  actionLabel?: string
  cancelLabel?: string
}

/** A complete confirmation: trigger, title, description, Cancel and the action. */
function Confirm({
  defaultOpen = false,
  actionVariant = "danger",
  triggerLabel = "Delete account",
  title = "Delete this account?",
  description = "Its balance must be zero. Statements stay available for 7 years. This cannot be undone.",
  actionLabel = "Delete account",
  cancelLabel = "Keep account",
}: ConfirmProps) {
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger render={<Button variant={actionVariant} />}>
        {triggerLabel}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction variant={actionVariant}>{actionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const meta = {
  title: "Components/AlertDialog",
  component: Confirm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dialog that needs an answer, built on Base UI `AlertDialog`. Always modal; clicking the backdrop does not close it, Esc and Cancel do. Compose `AlertDialog` → `AlertDialogTrigger` + `AlertDialogContent` (→ `AlertDialogHeader` with `AlertDialogTitle` / `AlertDialogDescription`, `AlertDialogFooter` with `AlertDialogCancel` and `AlertDialogAction`). These stories wrap a full example (`Confirm`) so the controls drive the real parts.",
      },
    },
  },
  args: {
    defaultOpen: false,
    actionVariant: "danger",
    triggerLabel: "Delete account",
    title: "Delete this account?",
    description:
      "Its balance must be zero. Statements stay available for 7 years. This cannot be undone.",
    actionLabel: "Delete account",
    cancelLabel: "Keep account",
  },
  argTypes: {
    actionVariant: { control: "inline-radio", options: ["primary", "danger"] },
  },
} satisfies Meta<typeof Confirm>

export default meta
type Story = StoryObj<typeof meta>

/** Click the button to open. Try clicking the backdrop: it stays open. Esc or Cancel closes it. */
export const Playground: Story = {}

/** Open on load, to check layout and the overlay. Cancel has focus. */
export const Destructive: Story = {
  args: { defaultOpen: true },
  parameters: ownFrame,
}

/** A consequential action that is not destructive: primary action, specific verb. */
export const Confirmation: Story = {
  args: {
    defaultOpen: true,
    actionVariant: "primary",
    triggerLabel: "Send payment",
    title: "Send $2,400.00 to Northwind Ltd?",
    description: "The payment leaves today and arrives within one business day.",
    actionLabel: "Send payment",
    cancelLabel: "Cancel",
  },
  parameters: ownFrame,
}

/** Controlled: the app decides when it opens and reacts to the answer. */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [answer, setAnswer] = React.useState("No answer yet")
    return (
      <div className="grid justify-items-start gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Revoke API key
        </Button>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {answer}
        </p>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
              <AlertDialogDescription>
                Apps using it stop working immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAnswer("Kept the key")}>
                Keep key
              </AlertDialogCancel>
              <AlertDialogAction
                variant="danger"
                onClick={() => setAnswer("Revoked the key")}
              >
                Revoke key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  },
}

/**
 * An action that waits for a server. Returning a promise from `onClick` keeps
 * the dialog open with a spinner on the action; Cancel and Esc are blocked.
 * The first try fails and shows an error inside the dialog; the second succeeds.
 */
export const AsyncAction: Story = {
  parameters: ownFrame,
  render: () => {
    const [attempts, setAttempts] = React.useState(0)
    const [error, setError] = React.useState<string | null>(null)
    const [result, setResult] = React.useState("Not deleted yet")

    async function deleteStatement() {
      setError(null)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const attempt = attempts + 1
      setAttempts(attempt)
      if (attempt === 1) {
        setError("The server didn't respond. Nothing was deleted. Try again.")
        throw new Error("Request failed")
      }
      setResult("Statement deleted")
    }

    return (
      <div className="grid justify-items-start gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {result}
        </p>
        <AlertDialog
          defaultOpen
          onOpenChange={(open) => {
            if (!open) setError(null)
          }}
        >
          <AlertDialogTrigger render={<Button variant="danger" />}>
            Delete statement
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete the March statement?</AlertDialogTitle>
              <AlertDialogDescription>
                It is removed for everyone on this account. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="danger" onClick={deleteStatement}>
                Delete statement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  },
}

/** Open in dark mode (`.dark` on <html>). */
export const Dark: Story = {
  args: { defaultOpen: true },
  parameters: ownFrame,
  decorators: [withDarkHtml],
}
