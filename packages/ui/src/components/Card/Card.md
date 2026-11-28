# Card

**Purpose:** A container that groups the content and actions about one subject, such as an account summary.

## When to use

- A summary of one thing with a few facts and actions, such as an account with its balance and a Transfer button.
- A dashboard or feed of mixed content that people browse.
- A small set of options people pick between, each with a short description.

## When not to use

| Instead of a card for…                                        | Use                                                       |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| Many items of the same kind that people search or compare     | A list or table. Fields line up and scan faster. Nielsen Norman Group calls replacing lists with cards an anti-pattern. |
| A single block of page content                                | Plain content with a heading. A box adds visual weight and nothing else. |
| A card inside a card                                          | Headings and spacing inside one card.                     |
| A form or task that needs focus                               | The page, or a **Dialog**.                                |

## Writing the content

- **Title:** short and specific, saying what the card is about, such as "Everyday account".
- **Description:** one line of supporting detail, such as an account number or date.
- **Actions:** one main action, with a verb and noun, such as "Transfer funds". Put the main actions in the footer. Put a persistent or low-priority action, such as a menu or Edit, in the header's top-right corner.
- **In a grid,** put the key fact, such as a balance, in the same place on every card.

## Anatomy

| Part                | Role                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| **Card**            | The container: background, faint edge, rounded corners, padding.        |
| **CardHeader**      | Holds the title, description and action.                               |
| **CardTitle**       | The title. **Put a heading inside it**; see below.                      |
| **CardDescription** | A line of muted supporting text under the title.                        |
| **CardAction**      | A slot in the header's top-right corner, for one button or menu.        |
| **CardContent**     | The body.                                                               |
| **CardFooter**      | A row at the bottom, usually for actions.                               |

## Import and use

Install the package, then import its stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install @chonny_iamsrithong/lab-package
```

```tsx
import "@chonny_iamsrithong/lab-package/styles.css"
```

Then import the component where you use it:

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chonny_iamsrithong/lab-package"

<Card>
  <CardHeader>
    <CardTitle>
      <h3>Everyday account</h3>
    </CardTitle>
    <CardDescription>Account 1234 5678</CardDescription>
  </CardHeader>
  <CardContent>
    <p>$4,820.15</p>
  </CardContent>
</Card>
```

- Import only the parts you use.
- Card has no `"use client"` and needs none: it renders in Server Components.
- Define `--font-heading` in your app; the title uses it.

## Headings and lists

- **The title must be a real heading.** CardTitle is a `div` that styles whatever is inside it, so put an `h2`, `h3` or similar inside, at the level that fits the page. Don't skip levels. A title that only looks like a heading fails WCAG 1.3.1. TODO: CardTitle could render the heading itself.
- **Several cards are a list.** Wrap them in `ul` and `li`, give the list an `aria-label`, and give every card a heading at the same level, as the `CardList` story does. GitHub Primer and Inclusive Components both do this.
- **Don't make a card a landmark.** Leave it as a `div`; screen readers already have the heading and the list to navigate by.

## Props and variants

Card has **no `variant` prop**. It has a card-coloured background, a faint 1px edge, 18px corners and no shadow. A shadow suggests the card is clickable, and IBM Carbon avoids them on static containers.

### Card

| Prop        | Default | What it does                                                        |
| ----------- | ------- | ------------------------------------------------------------------- |
| `size`      | `md`    | `md`: 24px padding and gaps. `sm`: 16px, for dense layouts.         |
| `className` | none    | For one-off tweaks, such as width or a grid position.               |

### CardHeader and CardFooter

Add the `border-b` class to the header, or `border-t` to the footer, for a divider line. The spacing next to it matches the card's padding. The footer is a row; add a gap between its buttons with `className`.

### CardAction

One button or menu in the header's top-right corner. **Name it after the card**, such as `aria-label="More options for Savings goal"`, so it makes sense out of context.

### Images

An image as the card's first child runs edge to edge at the top, with no padding above it.

- **Decorative image:** `alt=""`, as the `WithImage` story does.
- **Meaningful image:** describe it in `alt`. Inclusive Components suggests putting a meaningful image after the heading in the code and moving it to the top with CSS, so heading navigation doesn't skip it. Our edge-to-edge style only works when the image comes first in the code. TODO: decide which matters more.

### Clickable cards

There's no built-in clickable card. When the whole card opens one thing, follow the `ClickableCard` story:

- **Make the heading the one link,** and stretch it over the card with a pseudo-element. Don't wrap the card in a link: screen readers would then read the whole card as the link's name.
- **Show focus on the whole card** while the link has keyboard focus, with a solid outline in the ring colour.
- **Keep other buttons out,** or keep them few, at least 24px, and well apart from each other. IBM Carbon allows none; Nielsen Norman Group and Fluent allow secondary actions. Sources disagree.
- **Text under the link can't be selected.**

TODO: decide whether to build the clickable card in.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Contrast

| What                                 | Light | Dark  | Needs |
| ------------------------------------ | ----- | ----- | ----- |
| Description text                     | 5.27  | 7.29  | 4.5   |
| Focus outline of a clickable card    | 5.25  | 4.60  | 3     |
| Card edge against the page           | 1.25  | 1.26  | see below |

The edge is decoration. A static card is identified by its content, so WCAG 1.4.11 doesn't require 3:1. If the edge is ever the only sign that a card is selected or clickable, it would. axe (WCAG 2.2 AA) passes every story.

## Tokens used

| Token               | Used for                                     |
| ------------------- | -------------------------------------------- |
| `--card`            | Background                                   |
| `--card-foreground` | Text                                         |
| `--foreground`      | The edge, at 10%                             |
| `--muted-foreground`| Description text                             |
| `--border`          | Header and footer dividers                   |
| `--radius`          | Corners: 1.8 × `--radius` (18px)             |
| `--font-heading`    | Title font. **Your app must define it.**     |

## Example

The `Playground` story:

```tsx
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chonny_iamsrithong/lab-package"

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
```
