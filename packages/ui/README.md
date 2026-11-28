# @chonny_iamsrithong/lab-package

React design system components: shadcn/ui converted to Base UI primitives, styled with CSS Modules over OKLCH design tokens, with light and dark modes. Built for Next.js App Router apps and works in any React 19 app.

## Install

```bash
npm install @chonny_iamsrithong/lab-package
```

Peer dependencies: `react` and `react-dom` 19, which your app already has.

- **Chart:** also install `recharts` 3 (`npm install recharts`). You build charts from its parts, and the app must have exactly one copy.
- **Data tables:** the recipe in the `Table` docs (sorting, filtering, selection, pagination) uses `@tanstack/react-table` 8. Install it in your app if you use the recipe; the package does not depend on it.

## Set up the stylesheet

All component styles and design tokens come in one precompiled file, `@chonny_iamsrithong/lab-package/styles.css`. Import it **once**, at the root of the app. Your app does not need to scan this package with Tailwind.

In Next.js, import it in `app/layout.tsx`, after your own global CSS:

```tsx
// app/layout.tsx
import "./globals.css"
import "@chonny_iamsrithong/lab-package/styles.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Your app provides three things the stylesheet does not:

1. **A CSS reset.** Components assume Tailwind v4's preflight, so `globals.css` starts with `@import "tailwindcss";`.
2. **`--font-heading`** on an ancestor. `DialogTitle`, `AlertDialogTitle` and `CardTitle` use it; other text inherits your app's font.
3. **`.dark` on an ancestor** (usually `<html>`) for dark mode, for example with `next-themes` and `attribute="class"`.

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --font-heading: ui-sans-serif, system-ui, sans-serif;
}
```

What the stylesheet contains:

- **Tokens:** every color, `--radius` and chart/sidebar variable, on `:root` (light) and `.dark` (dark).
- **Base rule:** `* { border-color: var(--border); outline-color: ring/50 }` in `@layer base`. Components rely on it.
- **Component styles:** every rule sits in `@layer components`, and the file declares `@layer theme, base, components, utilities`.

**Overrides:** a Tailwind utility passed through `className` beats the component's own styles without `!important`, because utilities live in a later layer. To retheme, redefine a token on `:root` / `.dark` after importing the stylesheet.

## Example

A Card with two Buttons, from the Card `Playground` story. It needs no `"use client"`, so it can sit in a Server Component page:

```tsx
// app/page.tsx
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chonny_iamsrithong/lab-package"

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>Everyday account</h3>
        </CardTitle>
        <CardDescription>BSB 062-000 · Account 1234 5678</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium">$4,820.15</p>
        <p className="text-muted-foreground">Available balance</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Transfer</Button>
        <Button size="sm" variant="outline">
          Statements
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Components and docs

Everything is imported from the package root, `@chonny_iamsrithong/lab-package`. Each component has a usage doc in the package at `node_modules/@chonny_iamsrithong/lab-package/dist/docs/<Name>.md`: when to use it, every part, its props and variants, the tokens it uses, and an example. Read it before building with the component.

| Component     | Public parts                                                                                                                                                                                     | Doc                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| Accordion     | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`                                                                                                                             | `dist/docs/Accordion.md`   |
| AlertDialog   | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` | `dist/docs/AlertDialog.md` |
| Attachment    | `Attachment`, `AttachmentMedia`, `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription`, `AttachmentActions`, `AttachmentAction`, `AttachmentTrigger`, `AttachmentGroup`              | `dist/docs/Attachment.md`  |
| Avatar        | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`                                                                                                      | `dist/docs/Avatar.md`      |
| Badge         | `Badge`                                                                                                                                                                                          | `dist/docs/Badge.md`       |
| Button        | `Button`                                                                                                                                                                                         | `dist/docs/Button.md`      |
| Card          | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`                                                                                                  | `dist/docs/Card.md`        |
| Chart         | `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`                                                                                       | `dist/docs/Chart.md`       |
| Checkbox      | `Checkbox`                                                                                                                                                                                       | `dist/docs/Checkbox.md`    |
| Dialog        | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`                                   | `dist/docs/Dialog.md`      |
| Input         | `Input`                                                                                                                                                                                          | `dist/docs/Input.md`       |
| InputGroup    | `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`                                                                                   | `dist/docs/InputGroup.md`  |
| InputOTP      | `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`                                                                                                                                 | `dist/docs/InputOTP.md`    |
| Table         | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`                                                                                         | `dist/docs/Table.md`       |
| Textarea      | `Textarea`                                                                                                                                                                                       | `dist/docs/Textarea.md`    |

Prop types are exported alongside the components, for example `ButtonProps`, `ButtonVariant` and `ChartConfig`. `ChartStyle` is an advanced helper: `ChartContainer` already renders it, so you rarely need it.

### Server components

`AlertDialog`, `Attachment`, `Avatar`, `Chart`, `Checkbox`, `Dialog`, `InputGroup`, `InputOTP` and `Table` ship with `"use client"`. `Accordion`, `Badge`, `Button`, `Card`, `Input` and `Textarea` have no directive, matching their source. Any component can render from a Server Component; passing event handlers or controlled state (`open` + `onOpenChange`, `value` + `onValueChange`) needs a file that starts with `"use client"`.

## Develop

From the repo root (an npm workspace):

```bash
npm install
npm run build -w @chonny_iamsrithong/lab-package       # vite build → packages/ui/dist/ (ESM, .d.ts, styles.css, docs/)
npm run typecheck -w @chonny_iamsrithong/lab-package   # tsc --noEmit
npm run pack:check -w @chonny_iamsrithong/lab-package  # npm pack --dry-run: lists exactly what would publish
npm run storybook                                       # component props and states, http://localhost:6006
```

How the build works and the rules for changing components are in [AGENTS.md](https://github.com/chonnaphat-design/lab-package/blob/main/AGENTS.md).
