import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "../Button"
import { Input } from "../Input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"

/** Open dialogs are modal and fixed to the viewport, so docs show them in their own iframe. */
const ownFrame = { docs: { story: { inline: false, iframeHeight: 420 } } }

/** DialogContent portals to <body>, so dark mode goes on <html> like a theme switcher would. */
const withDarkHtml: Decorator = (Story) => {
  React.useEffect(() => {
    const html = document.documentElement
    html.classList.add("dark")
    return () => html.classList.remove("dark")
  }, [])
  return <Story />
}

type TransferDialogProps = {
  /** Show the × button in the corner (`DialogContent showCloseButton`). */
  showCloseButton?: boolean
  /** Append an outline "Close" button (`DialogFooter showCloseButton`). */
  footerCloseButton?: boolean
  /** Start open. */
  defaultOpen?: boolean
  title?: string
  description?: string
}

/** A complete dialog: trigger, header, a labelled field, footer actions. */
function TransferDialog({
  showCloseButton = true,
  footerCloseButton = false,
  defaultOpen = false,
  title = "Transfer funds",
  description = "Move money between your accounts. Transfers arrive instantly.",
}: TransferDialogProps) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button />}>Transfer funds</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <label htmlFor="transfer-amount" className="text-sm font-medium">
            Amount
          </label>
          <Input id="transfer-amount" inputMode="decimal" placeholder="0.00" />
        </div>
        <DialogFooter showCloseButton={footerCloseButton}>
          {!footerCloseButton && (
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          )}
          <DialogClose render={<Button />}>Transfer</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const meta = {
  title: "Components/Dialog",
  component: TransferDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal dialog built on Base UI `Dialog`. Compose `Dialog` → `DialogTrigger` + `DialogContent` (→ `DialogHeader` with `DialogTitle` / `DialogDescription`, body, `DialogFooter`). `DialogClose` closes it; pass `render={<Button … />}` to style it. These stories wrap a full example (`TransferDialog`) so the controls drive the real parts.",
      },
    },
  },
  args: {
    showCloseButton: true,
    footerCloseButton: false,
    defaultOpen: false,
    title: "Transfer funds",
    description: "Move money between your accounts. Transfers arrive instantly.",
  },
} satisfies Meta<typeof TransferDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Click the button to open. Esc, the ×, Cancel or a click outside closes it. */
export const Playground: Story = {}

/** Open on load, to check layout and the overlay. */
export const Open: Story = {
  args: { defaultOpen: true },
  parameters: ownFrame,
}

/** No × in the corner; the footer's built-in outline "Close" button instead. */
export const FooterCloseButton: Story = {
  args: { defaultOpen: true, showCloseButton: false, footerCloseButton: true },
  parameters: ownFrame,
}

/** A destructive confirmation: no body, danger action. */
export const Destructive: Story = {
  parameters: ownFrame,
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="danger" />}>Delete account</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete this account?</DialogTitle>
          <DialogDescription>
            Its balance must be zero. Statements stay available for 7 years. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Keep account</DialogClose>
          <DialogClose render={<Button variant="danger" />}>Delete account</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** Open in dark mode (`.dark` on <html>). */
export const Dark: Story = {
  args: { defaultOpen: true },
  parameters: ownFrame,
  decorators: [withDarkHtml],
}
