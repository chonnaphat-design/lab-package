# Attachment

**Purpose:** A card for one attached file, showing its name, type and size or upload status, with small actions such as Remove.

## When to use

- Files the user has added to a form or message, before or after they upload: a receipt, a statement, a photo of an ID.
- Files already attached to a record, where people open, download or remove them.

## When not to use

| Instead of an attachment for…                           | Use                                                   |
| ------------------------------------------------------- | ----------------------------------------------------- |
| Choosing files to upload                                | A file input. TODO: the package has no file picker or drop zone yet; Input with `type="file"` works. |
| A plain link to a document in running text              | A text link                                           |
| A status label on its own                               | **Badge**                                             |
| A gallery of images to browse                           | TODO: no gallery or image grid yet.                   |

## Writing the content

- **Title:** the file name, including its extension, such as `q3-statement.pdf`.
- **Description:** type and size while it's done, such as "PDF · 2.4 MB". While uploading, the progress, such as "Uploading · 64%". If it fails, what went wrong and what to do, such as "Upload failed. Try again." or "Must be smaller than 10 MB". GOV.UK's wording is a good model.
- **Action labels name the file:** "Remove q3-statement.pdf", "Retry budget-2026.xlsx", "Open q3-statement.pdf". A bare "Remove" doesn't say which file.
- **While uploading,** say "Cancel upload of q3-statement.pdf" rather than "Remove", so people know what the button does at that moment.

## Anatomy

| Part                      | Role                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Attachment**            | The card. Holds the state, size and orientation.                                    |
| **AttachmentMedia**       | A square slot for a file-type icon or an image thumbnail.                           |
| **AttachmentContent**     | Holds the title and description.                                                    |
| **AttachmentTitle**       | The file name. Truncated with an ellipsis when it doesn't fit.                      |
| **AttachmentDescription** | Type and size, or the upload status.                                                |
| **AttachmentActions**     | The small buttons at the end of the row, or the top-right of a tile.                |
| **AttachmentAction**      | One small icon button, such as Remove or Retry.                                     |
| **AttachmentTrigger**     | Optional. A link or button stretched over the whole card to open the file.         |
| **AttachmentGroup**       | Optional. A row of attachments that scrolls sideways.                               |

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
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "lab-package"
import { FileTextIcon, XIcon } from "lucide-react"

<Attachment>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>q3-statement.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove q3-statement.pdf">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

- Import only the parts you use.
- Attachment ships with `"use client"`, so you can render it from a Server Component. A file that passes a function, such as `onClick` on AttachmentAction, must start with `"use client"`.
- Icons come from `lucide-react`. Install it in your app to use them: `npm install lucide-react`.

## Props and variants

### Attachment

| Prop          | Default      | What it does                                                                                 |
| ------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `state`       | `done`       | `idle`: chosen but not uploaded, dashed border. `uploading` and `processing`: the name shimmers. `error`: red-tinted border and icon, red description. `done`: plain. |
| `size`        | `md`         | `md`, `sm` or `xs`: the padding, text size and media size. Media is 40px, 32px or 28px.     |
| `orientation` | `horizontal` | `horizontal`: a row, at least 160px wide. `vertical`: a tile, 96px wide (120px with text), with the actions in its top-right corner. |
| `className`   | none         | For one-off layout tweaks, such as full width.                                               |

The card fits its content by default. Make it fill a list with `className`, as the `Files` story does.

### AttachmentMedia

| Prop      | Default | What it does                                                                                     |
| --------- | ------- | ------------------------------------------------------------------------------------------------ |
| `variant` | `icon`  | `icon`: a file-type icon on a grey square. `image`: a thumbnail that fills the square, shown at 60% until the state is `done` or `idle`. |

Give a thumbnail `alt=""`. The file name beside it already says what it is.

### AttachmentAction

A Button that defaults to `variant="ghost"`, `size="xs"` and `iconOnly`, so it is 24 × 24px, exactly WCAG's minimum target. It takes every Button prop. **Always add an `aria-label` that names the file.**

### AttachmentTrigger

Stretches a button, or a link via `render`, over the whole card, so clicking anywhere opens the file. The actions stay on top and work on their own.

- Give it its own name, such as `aria-label="Open q3-statement.pdf"`.
- For a link, use `render={<a href="…" />}`.
- While it has keyboard focus, the whole card shows the focus ring.
- Text under it can't be selected.

### AttachmentGroup

A row that scrolls sideways and snaps to each card, with the edges fading out. **Prefer a plain list** for files people need to check: GOV.UK, IBM Carbon and the Ministry of Justice all stack files vertically. Nielsen Norman Group found people don't expect to scroll sideways. Keep the group for secondary uses, such as thumbnails above a message box.

### AttachmentTitle and AttachmentDescription

They take any `span` props. TODO: a truncated name can't be read in full. IBM Carbon shows the full name in a tooltip, while GOV.UK wraps long names instead. As a stopgap, set `title` to the full name, though that only helps mouse users.

## States

| State        | Look                                                          | Description to show                    |
| ------------ | ------------------------------------------------------------- | -------------------------------------- |
| `idle`       | Dashed border                                                  | "Ready to upload"                       |
| `uploading`  | The name shimmers; image thumbnails at 60%                     | Progress, such as "Uploading · 64%"     |
| `processing` | The name shimmers; image thumbnails at 60%                     | What's happening, such as "Checking the file" |
| `error`      | Red-tinted border, red icon on a red tint, red description    | What went wrong and how to fix it      |
| `done`       | Plain                                                          | Type and size                           |

The state is always shown in words too, not by colour or motion alone. The shimmer stops when the user has asked for reduced motion.

- **No progress bar.** TODO: Nielsen Norman Group recommends a percentage or bar for anything over 10 seconds, and no system reviewed uses a shimmer for uploads. For now, put the percentage in the description.
- **The shimmer runs as long as the upload.** TODO: WCAG 2.2.2 asks for a way to pause motion that lasts more than 5 seconds next to content people use. Decide whether to keep it for long uploads.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

### Accessibility you have to add

- **Announce changes.** Screen readers aren't told when a file finishes or fails. Add one polite status message for the list, such as "q3-statement.pdf uploaded", and announce errors as alerts. Announce progress every 10% or so, not on every change. WCAG 4.1.3 requires this. TODO: build it in.
- **Move focus after Remove.** Send focus to the next file's Remove button, or the previous one when the last file goes. If the list is empty, send it to the file picker. Consider an undo.
- **Give every action a name** that includes the file name.

## Contrast

| What                                | Light | Dark | Needs |
| ----------------------------------- | ----- | ---- | ----- |
| Description                         | 5.27  | 7.29 | 4.5   |
| Error description                   | 5.44  | 5.87 | 4.5   |
| Error icon on its tint              | 5.92  | 5.13 | 3     |
| Focus border while the trigger has focus | 5.25 | 4.60 | 3 |
| Card border against the page        | 1.23  | 1.26 | see below |
| Error border against the page       | 1.83  | 1.58 | see below |

The borders are faint. The card is identified by its content, and the error state also shows as text and a red icon, so the border isn't the only cue. axe (WCAG 2.2 AA) passes every story.

## Tokens used

| Token                | Used for                                                     |
| -------------------- | ------------------------------------------------------------ |
| `--card`             | Card background                                              |
| `--card-foreground`  | Card text                                                    |
| `--border`           | Card border                                                  |
| `--muted`            | Media background, and the card's hover fill at 50% when it has a trigger |
| `--muted-foreground` | Description text                                             |
| `--foreground`       | Media icon                                                   |
| `--destructive`      | Error border (30%), media tint (10%), icon and description   |
| `--ring`             | Focus border and ring while the trigger has focus            |
| `--radius`           | Card corners: 1.8 × `--radius` (18px), 1.4 × at `xs`. Media corners: 1.4 ×, 1 × at `xs`. |

## Example

The `Playground` story, with its default controls:

```tsx
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "lab-package"
import { FileTextIcon, XIcon } from "lucide-react"

<Attachment>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>q3-statement.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove q3-statement.pdf">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```
