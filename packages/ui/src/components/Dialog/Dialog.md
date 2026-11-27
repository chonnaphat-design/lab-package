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
| Opening from another dialog                                          | Avoid stacking dialogs. Replace the content or move to a page. Most systems forbid it; GitHub Primer allows two at most. |
| Content that needs scrolling on a laptop screen                      | A separate page. A dialog can scroll, but only as a fallback.    |

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

## Import and use

Install the package, then import its stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install lab-package
```

```tsx
import "lab-package/styles.css"
```

Then import the component where you use it:

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
} from "lab-package"

<Dialog>
  <DialogTrigger render={<Button />}>Rename</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename account</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

- Import only the parts you use. Buttons come from the same package.
- Dialog ships with `"use client"`, so a dialog that only opens and closes renders from a Server Component. Controlling `open`, or saving a form, needs a file that starts with `"use client"`.
- Define `--font-heading` in your app; the title uses it.

## Props and variants

Dialog has **no `variant` or `size` props**. Every dialog uses the same panel. Style the buttons inside it with Button's own variants.

### Dialog

| Prop                      | Default | What it does                                                                                                                                       |
| ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen`             | `false` | Starts open. The dialog then manages its own open state.                                                                                           |
| `open` + `onOpenChange`   | none    | Lets the app control when it is open, for example to close only after a save succeeds.                                                            |
| `modal`                   | `true`  | `true`: focus is trapped, page scroll is locked, the page behind can't be clicked. `"trap-focus"`: focus is trapped, but the page can still scroll and be clicked. `false`: the page stays usable, for helper tools the user works alongside, such as find and replace. |
| `disablePointerDismissal` | `false` | When `true`, clicking the backdrop no longer closes the dialog. Esc, × and Cancel still close it. **Set it on any dialog with a form**, so a stray click doesn't throw away what the user typed. |

### DialogContent

| Prop              | Default | What it does                                                                                                     |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `showCloseButton` | `true`  | Shows the × button in the top-right corner. It is a small ghost icon button labelled "Close" for screen readers. |
| `initialFocus`    | first focusable element | Which element gets focus when the dialog opens. The × comes last, so in a form dialog the first field gets focus, as WAI-ARIA, IBM Carbon and Microsoft Fluent recommend. Opened by touch, the panel itself is focused instead, so the on-screen keyboard doesn't pop up. |
| `finalFocus`      | the trigger | Which element gets focus back when the dialog closes.                                                      |

### DialogFooter

| Prop              | Default | What it does                                                                                    |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `showCloseButton` | `false` | Adds an outline "Close" button at the end of the actions. Use it instead of the × for read-only dialogs. |

### DialogTrigger and DialogClose

Both take `render` to show as a Button, such as `render={<Button variant="outline" />}`. Any Button variant works.

### Built-in behaviour

- **Opening:** the backdrop and panel fade in over 100ms, at the fast end of what Material and Carbon use. The panel also scales up slightly. TODO: the animation still plays when the user has asked for reduced motion. WCAG only requires that at AAA.
- **Closing:** Esc, the ×, any DialogClose, or a click on the backdrop. Focus goes back to the trigger.
- **Layout:** the panel is centred on screen, up to 448px wide on screens 640px and wider, and the full width minus 16px each side on smaller screens. 24px padding and 24px between sections.
- **One width only.** Most systems offer three to five sizes, and GitHub Primer makes form dialogs full screen on phones. TODO: decide whether Dialog needs sizes or a full-screen mode on mobile.

**Tall content scrolls inside the panel.** The panel is never taller than the screen minus 16px top and bottom. When content is longer, the whole panel scrolls, title and buttons included, so everything stays reachable on a phone and at 400% browser zoom (WCAG 1.4.10 Reflow). Tabbing to a button scrolls it into view.

TODO: IBM Carbon, Microsoft Fluent and GitHub Primer keep the title and buttons fixed while only the body scrolls. Ours scrolls everything, which works at any zoom but hides the buttons in a long dialog until the user scrolls. Decide whether to pin them, and how that behaves at 400% zoom.

### Forms in a dialog

- **Wrap the fields and the footer in one form**, and make the main action a `type="submit"` Button rather than a DialogClose. Then Enter in a field submits it. The `Playground` story has no form, so Enter does nothing there.
- **Keep the dialog open until the save succeeds.** Control it with `open` and `onOpenChange`, and close it yourself on success.
- **Show errors inside the dialog**, next to the field, with Input's `invalid`. Don't close the dialog to report them.
- **Set `disablePointerDismissal`** so a click on the backdrop doesn't lose the user's input.
- TODO: Dialog has no loading state for its submit button. AlertDialogAction has one; Dialog doesn't yet. Until it does, prevent double submits in the app.
- TODO: there is no pattern yet for asking "Discard changes?" when the user closes a dialog with unsaved input.

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

The backdrop is fixed black at 80% opacity with a light blur, not a token. That is much heavier than Material's 32% dim, and none of the systems reviewed use a blur. TODO: decide on the backdrop strength, and whether it should become a token so it can be themed.

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

On open, focus goes to the Amount field, the first focusable element. In a real form, wrap the field and footer in a form and make Transfer a submit button. See [Forms in a dialog](#forms-in-a-dialog).
