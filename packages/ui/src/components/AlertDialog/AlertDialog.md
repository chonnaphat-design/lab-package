# AlertDialog

**Purpose:** A modal window that stops the user and asks them to confirm or cancel one consequential action before anything happens.

## When to use

- **Before an uncommon action that can't be undone**, such as deleting an account, revoking a key or cancelling a payment.
- **Before a consequential action the user might trigger by mistake**, such as sending money or publishing to customers.
- When the user must answer before going on, and only two answers make sense: go ahead, or don't.

Keep it rare. When people see confirmations for routine actions, they learn to click through without reading.

## When not to use

| Instead of an alert dialog for…                          | Use                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| A task with fields, such as a form or a rename           | **Dialog**                                                             |
| A common action that can be undone, even a delete        | Just do it and offer undo. Don't ask first.                            |
| A success message or other information with no decision  | An inline message or a toast. TODO: the package has neither yet.       |
| A message on page load, before the user has done anything | Inline content on the page                                            |
| A severe, wide-reaching delete that needs the user to type the item's name to confirm | TODO: no pattern yet. Keep it for rare, high-impact actions, and design it with a design review. |
| Form errors                                              | Show them inline beside the field, with Input's `invalid`              |
| More than two choices                                    | TODO: no pattern yet. Don't add a third button without a design review. |

## Writing the content

- **Title:** a question that names the action and its object, such as "Delete this account?" or "Send $2,400.00 to Northwind Ltd?". Avoid "Are you sure?" and "Warning!".
- **Description:** always include one. Say what will happen, name what is affected, and say whether it can be undone, in one or two sentences. Don't repeat the title.
- **Action button:** repeat the verb from the title, such as "Delete account" or "Send payment". Never "OK", "Yes" or "Confirm". Use "Delete" when the item is destroyed and "Remove" when it still exists elsewhere.
- **Cancel button:** "Cancel". Most guidance asks for exactly this word. The stories also use "Keep account" and "Keep key", which say what is kept. TODO: pick one rule for the product.
- **Order:** Cancel first, then the action. On wide screens the action sits on the right, and on small screens it sits on top.
- **Don't rely on colour:** the red `danger` button must be backed by a label that says what is destroyed, so the meaning doesn't depend on seeing red.

## Anatomy

| Part                       | Role                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **AlertDialog**            | Holds the open/closed state. Renders nothing itself.                                       |
| **AlertDialogTrigger**     | The control that opens it. Usually rendered as a Button.                                   |
| **AlertDialogContent**     | The panel, with its own dimmed backdrop. It has **no × button**: the user answers with a button. |
| **AlertDialogHeader**      | Stacks the title and description.                                                          |
| **AlertDialogTitle**       | Required. The question. Screen readers announce it on open.                                |
| **AlertDialogDescription** | Required. The consequence. WAI-ARIA expects every alert dialog to have this message, and screen readers announce it on open. |
| **AlertDialogFooter**      | The two buttons.                                                                           |
| **AlertDialogCancel**      | The safe answer. Closes the dialog and does nothing else.                                  |
| **AlertDialogAction**      | The confirming answer. Runs its click handler, then closes the dialog, or waits for slow work first. |

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
"use client"

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
  Button,
} from "lab-package"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="danger" />}>Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this account?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="danger" onClick={deleteAccount}>Delete account</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

- AlertDialog ships with `"use client"`. The action needs an `onClick`, so the file that renders it starts with `"use client"` too, as above.
- `deleteAccount` can be `async`: the dialog then waits for it. See AlertDialogAction below.
- Define `--font-heading` in your app; the title uses it.

## Props and variants

AlertDialog has **no `variant` or `size` of its own**. Every alert dialog uses the same panel as Dialog. The two buttons take Button's `variant` and `size`.

### AlertDialog

| Prop                    | Default | What it does                                                                                 |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `defaultOpen`           | `false` | Starts open.                                                                                 |
| `open` + `onOpenChange` | none    | Lets the app control when it opens, for example to open it after another event.             |

It has no `modal` or `disablePointerDismissal` props, unlike Dialog. It is always modal and never closes on a backdrop click.

### AlertDialogAction

| Prop      | Default   | What it does                                                         |
| --------- | --------- | -------------------------------------------------------------------- |
| `variant` | `primary` | Use `danger` for actions that can't be undone. Use `primary` for the rest. |
| `size`    | `md`      | Button size: `xs`, `sm`, `md` or `lg`. Keep it the same as Cancel.   |
| `onClick` | none      | Runs the action. If the work finishes at once, the dialog closes right after. If it returns a promise, see below. |
| `disabled` | `false`  | Disables the button.                                                 |

**Slow work, such as a server request:** have `onClick` return a promise (an `async` function does). Then:
- the dialog **stays open** while it runs, with a spinner on the action button;
- the action, Cancel and Esc are blocked, so the user can't abandon it halfway or send it twice;
- when the promise **succeeds**, the dialog closes;
- when it **fails**, the dialog stays open and both buttons work again, so the user can retry or cancel. Show what went wrong inside the dialog, between the description and the buttons, with `role="alert"` so screen readers announce it. Say whether anything changed, such as "Nothing was deleted".

This follows Shopify Polaris, GitHub Primer and IBM Carbon: close only after success, show loading on the button, and keep errors in the dialog. See the `AsyncAction` story.

TODO: screen readers aren't told when the work starts. The button is marked busy, but most screen readers don't announce that. Decide whether to add a spoken "Deleting…" message.

TODO: there is no built-in error part. The story shows the message as a short red paragraph. Confirm that as the pattern, or add an error part to the component.

### AlertDialogCancel

| Prop      | Default   | What it does                       |
| --------- | --------- | ---------------------------------- |
| `variant` | `outline` | Keep it `outline`.                 |
| `size`    | `md`      | Keep it the same as the action.    |

Cancel is disabled automatically while slow work from the action is running.

### AlertDialogContent

| Prop           | Default                 | What it does                                                    |
| -------------- | ----------------------- | --------------------------------------------------------------- |
| `initialFocus` | first focusable element | Which element gets focus on open. With Cancel first, that is Cancel, which WAI-ARIA recommends for destructive actions. |
| `finalFocus`   | the trigger             | Which element gets focus back on close. If the action deleted the trigger's item, point it at a stable element instead, such as the list or its heading. |

TODO: for a confirmation that is **not** destructive (a `primary` action), GitHub Primer focuses the action instead of Cancel, while WAI-ARIA doesn't say. The component always focuses Cancel unless `initialFocus` is set. Decide whether non-destructive confirmations should change that.

### Built-in behaviour

- **Closing:** Esc, Cancel or the action. A click on the backdrop does **not** close it. While slow work from the action is running, nothing closes it.
- **Focus:** moves to the first button (Cancel) on open, stays inside the dialog, and returns to the trigger on close. Opened by touch, the panel itself is focused instead.
- **Screen readers:** announced as an alert dialog, with the title as its name and the description as its message. The page behind is hidden from them and from the keyboard.
- **Page:** scroll is locked and the page behind can't be clicked.
- **Opening:** the backdrop and panel fade in over 100ms, and the panel scales up slightly.
- **Layout:** the same panel as Dialog. It is centred, up to 448px wide on screens 640px and wider, and the full width minus 16px each side on smaller screens. 24px padding. It is never taller than the screen minus 16px top and bottom; longer content scrolls inside it.
- **Footer:** stacks full-width with the action on top on small screens. From 640px it is a right-aligned row with the action on the right.
- **Size of targets:** both buttons are at least 36px tall, above the 24px minimum.

TODO: on small screens the action is shown **above** Cancel, but Tab still reaches Cancel first. The visual order and the keyboard order don't match there. This follows Apple, Material and Carbon, but it hasn't been checked against WCAG's focus-order rule.

## Tokens used

| Token                  | Used for                                                                     |
| ---------------------- | ---------------------------------------------------------------------------- |
| `--popover`            | Panel background                                                             |
| `--popover-foreground` | Panel text                                                                   |
| `--foreground`         | A 1px ring around the panel at 5% opacity                                    |
| `--muted-foreground`   | Description text. Links in it turn `--foreground` on hover.                  |
| `--radius`             | Panel corners: 2.6 × `--radius` (26px)                                       |
| `--font-heading`       | Title font. **Your app must define it.** It is not in the shipped tokens.    |

The backdrop is fixed black at 80% opacity with a light blur, not a token. TODO: confirm whether it should become a token, the same open question as for Dialog.

The buttons use Button's tokens. `danger` uses `--destructive`. See [Button.md](../Button/Button.md).

Title is 16px medium. Description is 14px. Dark mode follows the `.dark` class on `<html>` or another ancestor of the page.

## Example

The `Destructive` story, written out (the story builds it from controls):

```tsx
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
  Button,
} from "lab-package"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="danger" />}>Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this account?</AlertDialogTitle>
      <AlertDialogDescription>
        Its balance must be zero. Statements stay available for 7 years. This
        cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep account</AlertDialogCancel>
      <AlertDialogAction variant="danger">Delete account</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

The story opens it on load with `defaultOpen`. It is left out here because a real confirmation opens from its trigger.
