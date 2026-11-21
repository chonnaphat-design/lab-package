# Dialog

**Purpose:** A modal window over the page that asks the user to finish or dismiss one short, focused task before they go back.

## When to use

- A short task that needs the user's full attention and fits on one screen: a transfer amount, a rename, a small form of one to three fields.
- A short task where the page behind should stay visible for context.

## When not to use

| Instead of a dialog for…                                             | Use                                                              |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Confirming a destructive or consequential action ("Delete this account?") | **AlertDialog**. See [AlertDialog.md](../AlertDialog/AlertDialog.md). |
| A success or other non-critical message                              | A toast or an inline message. TODO: the package has neither yet. |
| Form errors                                                          | Show them inline beside the field, with Input's `invalid`         |
| Long, complex or multi-step work, large tables                       | A separate page                                                  |
| A decision that needs the content the dialog would cover             | Inline content on the page                                       |
| Confirming a common action that can be undone                        | Just do it, and offer undo                                       |
| Information only, with no decision to make                           | Inline content. Don't interrupt.                                 |
| Opening from another dialog                                          | Never stack dialogs. Replace the content or move to a page.      |

## Writing the content

- **Title:** say what the user is doing or deciding, such as "Transfer funds" or "Delete this account?". Avoid vague titles like "Warning!", "Error" or "Are you sure?".
- **Buttons:** label them with specific verbs that echo the title ("Delete account", "Transfer"), not "OK" or "Yes / No".
- **Number of actions:** two is the norm, one main action and one way out. Use three only rarely.
- **Order:** the way out first, then the main action. The dialog then puts the main action on the right on wide screens and on top on small ones.
- **Always give a way out:** keep the × or include a Cancel-style button. Esc always works too.

## Anatomy

A dialog is built from these parts, top to bottom:

| Part                                | Role                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| **Dialog**                          | Holds the open/closed state. Renders nothing itself.                                     |
| **DialogTrigger**                   | The control that opens the dialog. Usually rendered as a Button.                         |
| **DialogContent**                   | The panel itself. Brings its own dimmed backdrop and, by default, a × close button.     |
| **DialogHeader**                    | Stacks the title and description.                                                        |
| **DialogTitle**                     | Required. A short heading that names the task. Screen readers announce it on open.      |
| **DialogDescription**               | Optional. One or two sentences of context, also announced on open.                      |
| Body                                | Any content: fields, text. There is no dedicated body part.                              |
| **DialogFooter**                    | The actions row.                                                                         |
| **DialogClose**                     | Closes the dialog. Render it as a Button for Cancel, or for an action that also closes. |

## Props and variants

Dialog has **no `variant` or `size` props**. Every dialog uses the same panel. Style the buttons inside it with Button's own variants.

### Dialog

| Prop                      | Default | What it does                                                                                                                                       |
| ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen`             | `false` | Starts open. The dialog then manages its own open state.                                                                                           |
| `open` + `onOpenChange`   | none    | Lets the app control when it is open, for example to close only after a save succeeds.                                                            |
| `modal`                   | `true`  | `true`: focus is trapped, page scroll is locked, the page behind can't be clicked. `"trap-focus"`: focus is trapped, but the page can still scroll and be clicked. `false`: the page stays usable. |
| `disablePointerDismissal` | `false` | When `true`, clicking the backdrop no longer closes the dialog. Esc, × and Cancel still close it.                                                  |

### DialogContent

| Prop              | Default | What it does                                                                                                     |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `showCloseButton` | `true`  | Shows the × button in the top-right corner. It is a small ghost icon button labelled "Close" for screen readers. |
| `initialFocus`    | first focusable element | Which element gets focus when the dialog opens. Opened by touch, the panel itself is focused instead, so the on-screen keyboard doesn't pop up. |
| `finalFocus`      | the trigger | Which element gets focus back when the dialog closes.                                                      |

### DialogFooter

| Prop              | Default | What it does                                                                                    |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `showCloseButton` | `false` | Adds an outline "Close" button at the end of the actions. Use it instead of the × for read-only dialogs. |

### DialogTrigger and DialogClose

Both take `render` to show as a Button, such as `render={<Button variant="outline" />}`. Any Button variant works.

### Built-in behaviour

- **Opening:** the backdrop and panel fade in over 100ms. The panel also scales up slightly.
- **Closing:** Esc, the ×, any DialogClose, or a click on the backdrop. Focus goes back to the trigger.
- **Layout:** the panel is centred on screen, up to 448px wide on screens 640px and wider, and the full width minus 16px each side on smaller screens. 24px padding and 24px between sections. TODO: there is no max height or scrolling for long content. Confirm how a dialog taller than the screen should behave.
- **Footer on small screens:** buttons stack full-width, with the last button in the code (the main action) on top. From 640px they sit in a row, right-aligned, with the main action on the right.

### Destructive confirmations

Use **AlertDialog** for actions that can't be undone, such as deleting or revoking. It never closes on a backdrop click, and screen readers announce it as an alert. See [AlertDialog.md](../AlertDialog/AlertDialog.md).

### Accessibility you get for free

- Focus moves into the dialog on open, stays inside while it is open, and returns to the trigger on close.
- Esc closes it.
- The title names the dialog and the description describes it for screen readers.
- The page behind can't be reached by keyboard or screen reader while it is open.
- The × button is 32 × 32px, above the 24px minimum target size.

You still have to:
- Always include a DialogTitle.
- Keep a visible way to close it (the × or a Cancel-style button). Touch screen-reader users need it.

## Tokens used

| Token                 | Used for                                                                               |
| --------------------- | -------------------------------------------------------------------------------------- |
| `--popover`           | Panel background                                                                       |
| `--popover-foreground`| Panel text                                                                             |
| `--foreground`        | A 1px ring around the panel at 5% opacity                                              |
| `--muted-foreground`  | Description text. Links inside the description turn `--foreground` on hover.           |
| `--radius`            | Panel corners: 2.6 × `--radius` (26px)                                                 |
| `--font-heading`      | Title font. **Your app must define it.** It is not in the shipped tokens.              |

The backdrop is fixed black at 80% opacity with a light blur, not a token. TODO: confirm whether the backdrop should become a token so it can be themed.

The × button, the footer "Close" button and any Buttons you place inside use Button's tokens. See [Button.md](../Button/Button.md).

Title is 16px medium. Description is 14px. Dark mode follows the `.dark` class on `<html>` or another ancestor of the page.

## Example

The `Playground` story's `TransferDialog`, written out with its default controls:

```tsx
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "lab-package"

<Dialog>
  <DialogTrigger render={<Button />}>Transfer funds</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Transfer funds</DialogTitle>
      <DialogDescription>
        Move money between your accounts. Transfers arrive instantly.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-2">
      <label htmlFor="transfer-amount" className="text-sm font-medium">
        Amount
      </label>
      <Input id="transfer-amount" inputMode="decimal" placeholder="0.00" />
    </div>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <DialogClose render={<Button />}>Transfer</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

On open, focus goes to the Amount field, the first focusable element.
