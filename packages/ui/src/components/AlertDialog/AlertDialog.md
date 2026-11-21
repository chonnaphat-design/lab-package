# AlertDialog

**Purpose:** A modal window that stops the user and asks them to confirm or cancel one consequential action before anything happens.

## When to use

- **Before an action that can't be undone**, such as deleting an account, revoking a key or cancelling a payment.
- **Before a consequential action the user might trigger by mistake**, such as sending money or publishing to customers.
- When the user must answer before going on, and only two answers make sense: go ahead, or don't.

## When not to use

| Instead of an alert dialog for…                          | Use                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| A task with fields, such as a form or a rename           | **Dialog**                                                             |
| A common action that can be undone                       | Just do it and offer undo. Don't ask first.                            |
| A success message or other information with no decision  | An inline message or a toast. TODO: the package has neither yet.       |
| Form errors                                              | Show them inline beside the field, with Input's `invalid`              |
| More than two choices                                    | TODO: no pattern yet. Don't add a third button without a design review. |

## Writing the content

- **Title:** a question that names the action and its object, such as "Delete this account?" or "Send $2,400.00 to Northwind Ltd?". Avoid "Are you sure?" and "Warning!".
- **Description:** say what will happen and whether it can be undone, in one or two sentences.
- **Action button:** repeat the verb from the title, such as "Delete account" or "Send payment". Never "OK" or "Yes".
- **Cancel button:** "Cancel", or a label that says what is kept, such as "Keep account".
- **Order:** Cancel first, then the action. On wide screens the action sits on the right, and on small screens it sits on top.

## Anatomy

| Part                       | Role                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **AlertDialog**            | Holds the open/closed state. Renders nothing itself.                                       |
| **AlertDialogTrigger**     | The control that opens it. Usually rendered as a Button.                                   |
| **AlertDialogContent**     | The panel, with its own dimmed backdrop. It has **no × button**: the user answers with a button. |
| **AlertDialogHeader**      | Stacks the title and description.                                                          |
| **AlertDialogTitle**       | Required. The question. Screen readers announce it on open.                                |
| **AlertDialogDescription** | Required in practice. The consequence. Screen readers announce it on open.                 |
| **AlertDialogFooter**      | The two buttons.                                                                           |
| **AlertDialogCancel**      | The safe answer. Closes the dialog and does nothing else.                                  |
| **AlertDialogAction**      | The confirming answer. Runs its click handler, then closes the dialog.                     |

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
| `onClick` | none      | Runs the action. The dialog closes right after.                      |

TODO: the action closes the dialog at once. There is no pattern yet for an action that has to wait for a server, such as showing a pending state and keeping the dialog open on failure.

### AlertDialogCancel

| Prop      | Default   | What it does                       |
| --------- | --------- | ---------------------------------- |
| `variant` | `outline` | Keep it `outline`.                 |
| `size`    | `md`      | Keep it the same as the action.    |

### AlertDialogContent

| Prop           | Default                 | What it does                                                    |
| -------------- | ----------------------- | --------------------------------------------------------------- |
| `initialFocus` | first focusable element | Which element gets focus on open. With Cancel first, that is Cancel. |
| `finalFocus`   | the trigger             | Which element gets focus back on close.                         |

### Built-in behaviour

- **Closing:** Esc, Cancel or the action. A click on the backdrop does **not** close it.
- **Focus:** moves to the first button (Cancel) on open, stays inside the dialog, and returns to the trigger on close. Opened by touch, the panel itself is focused instead.
- **Screen readers:** announced as an alert dialog, with the title as its name and the description as its message. The page behind is hidden from them and from the keyboard.
- **Page:** scroll is locked and the page behind can't be clicked.
- **Opening:** the backdrop and panel fade in over 100ms, and the panel scales up slightly.
- **Layout:** the same panel as Dialog. It is centred, up to 448px wide on screens 640px and wider, and the full width minus 16px each side on smaller screens. 24px padding.
- **Footer:** stacks full-width with the action on top on small screens. From 640px it is a right-aligned row with the action on the right.

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
