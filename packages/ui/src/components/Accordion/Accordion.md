# Accordion

**Purpose:** A stack of headings that each open to show a section, so people can pick the few sections they need from many.

## When to use

- Independent sections where most people need only one or two, such as an FAQ.
- An overview of many related sections, where the headings alone help people find their way.
- Dense information on small screens, or for frequent users doing familiar tasks.

## When not to use

| Instead of an accordion for…                                    | Use                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| Content all or most people need, or that is read straight through | Show it all, with headings. Long is fine when it's relevant. |
| A short page                                                    | Plain content                                          |
| Content people compare across sections                          | Show it open side by side. Sources disagree here: GOV.UK allows accordions for comparing, Nielsen Norman Group advises against. |
| Information needed to finish the current task, such as form fields | Show it on the page. Errors could end up hidden in a closed section. |
| Deeply nested information                                       | Separate pages, or a tree. Never put an accordion inside another. |
| A few switchable views of the same thing                        | TODO: the package has no Tabs yet.                     |

## Writing the headings

- **Short, specific, sentence case, no full stop**, such as "How long do transfers take?" or "Fees and limits".
- **Describe what's inside.** The heading is all people see before choosing.
- **Nothing interactive in the heading.** No links or buttons inside a trigger; the whole heading row is the button.

## Anatomy

| Part                 | Role                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| **Accordion**        | The bordered box around all the items. Holds which items are open.           |
| **AccordionItem**    | One section: a heading and its panel. Give each a unique `value`.            |
| **AccordionTrigger** | The heading and the button that opens and closes the section, with a chevron. |
| **AccordionContent** | The panel shown when the section is open.                                    |

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@chonny_iamsrithong/lab-package"

<Accordion>
  <AccordionItem value="transfers">
    <AccordionTrigger>How long do transfers take?</AccordionTrigger>
    <AccordionContent>
      <p>Transfers between your own accounts arrive instantly.</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

- Accordion has no `"use client"` of its own and needs none to open and close: it renders in Server Components. Using `value` with `onValueChange` needs a file that starts with `"use client"`.

## Props and variants

Accordion has **no `variant` or `size` props**. Each heading row is at least 54px tall, with 16px padding and 14px medium text. The box has 18px rounded corners and a thin border, with a line between items.

### Accordion

| Prop                       | Default | What it does                                                                 |
| -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `multiple`                 | `false` | Lets several sections stay open. By default, opening one closes the other. Turn it on when people may want to compare sections; Nielsen Norman Group recommends it, Base UI and Fluent default to one at a time. |
| `defaultValue`             | none    | Sections open on load, as an array of item values, such as `["transfers"]`. |
| `value` + `onValueChange`  | none    | Lets the app control which sections are open, for example for a "Show all" button. |
| `disabled`                 | `false` | Disables every section.                                                      |
| `hiddenUntilFound`         | `false` | Lets the browser's find-in-page search closed sections and open the one with a match. Supported in Chrome 102, Firefox 139 and Safari 26.2 and later. Turn it on for FAQs and help pages. |
| `keepMounted`              | `false` | Keeps closed panels in the page, hidden. Ignored when `hiddenUntilFound` is on. |
| `className`                | none    | For one-off layout tweaks.                                                   |

### AccordionItem

| Prop           | Default | What it does                                              |
| -------------- | ------- | --------------------------------------------------------- |
| `value`        | none    | The item's id, used by `defaultValue` and `value`. Make it unique. |
| `disabled`     | `false` | Dims this section to 50%, stops it opening, and skips it with Tab. |
| `onOpenChange` | none    | Runs when this section opens or closes.                   |

### AccordionContent

`className` styles the inside of the panel, where the content sits. Paragraphs get space between them, and links are underlined.

### Show all and hide all

There is no built-in "Show all sections" button. Nielsen Norman Group recommends one, and GOV.UK puts it on the left above the sections, labelled "Show all sections". Build it with `multiple`, `value` and `onValueChange`, as the `Controlled` story does. TODO: decide whether to build it in. GOV.UK also remembers open sections for the session; that isn't built in either.

### Built-in behaviour

- **Semantics:** each heading is a real button inside an `h3` heading, with `aria-expanded` telling screen readers whether it's open. Each open panel is a region labelled by its heading.
- **Keyboard:** Tab moves between headings and into open content. Enter or Space opens and closes. Arrow keys don't move between headings, following the 2026 WAI-ARIA update.
- **Open state:** the chevron points down when closed and up when open, and the open item gets a soft grey background. So the state never relies on colour alone.
- **Animation:** panels slide open and closed over 200ms. Nothing moves when the user has asked for reduced motion.

**Known issue: the heading level is always `h3`.** WAI-ARIA asks for the level that fits the page outline, and GOV.UK uses `h2` by default. TODO: let the heading level be set.

TODO: every open panel is a labelled region. WAI-ARIA warns that more than about six open at once clutters screen-reader navigation. With `multiple` and many sections, that can happen.

### States

| State    | How it is set               | Look                                                       |
| -------- | --------------------------- | ---------------------------------------------------------- |
| Hover    | Pointer over a heading      | Heading text underlines                                    |
| Focus    | Keyboard focus on a heading | Dark grey border and a 3px soft ring inside the row        |
| Open     | Clicked, or in `value`      | Chevron points up; soft grey background                    |
| Disabled | `disabled`                  | 50% opacity, can't be opened, skipped by Tab               |

TODO: GOV.UK removed link-like styling from its accordion because people took the headings for links. Ours underlines the heading on hover. Decide whether to keep it.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

### Contrast

| What                         | Light | Dark | Needs |
| ---------------------------- | ----- | ---- | ----- |
| Heading text, open item      | 18.58 | 16.53 | 4.5  |
| Chevron, closed              | 5.27  | 8.43 | 3     |
| Chevron, open                | 5.00  | 7.37 | 3     |
| Focus border against the page | 5.25 | 4.60 | 3     |

## Tokens used

| Token                | Used for                                             |
| -------------------- | ---------------------------------------------------- |
| `--border`           | The box's border and the lines between items         |
| `--muted`            | The open item's background, at 50%                   |
| `--muted-foreground` | The chevron                                          |
| `--foreground`       | Links inside a panel on hover                        |
| `--ring`             | Focus border and ring                                |
| `--radius`           | Box corners: 1.8 × `--radius` (18px)                 |

Heading and panel text take the page's text colour.

## Example

The `Playground` story, written out:

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@chonny_iamsrithong/lab-package"

<Accordion>
  <AccordionItem value="transfers">
    <AccordionTrigger>How long do transfers take?</AccordionTrigger>
    <AccordionContent>
      <p>
        Transfers between your own accounts arrive instantly. Payments to other
        banks usually arrive within one business day.
      </p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="cancel">
    <AccordionTrigger>Can I cancel a scheduled payment?</AccordionTrigger>
    <AccordionContent>
      <p>
        Yes, until 5pm the day before it's due. Open the payment from Scheduled
        and choose Cancel payment.
      </p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="statements">
    <AccordionTrigger>Where can I find my statements?</AccordionTrigger>
    <AccordionContent>
      <p>
        Statements for the last 7 years are under Accounts, then Statements. You
        can download each one as a PDF.
      </p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```
