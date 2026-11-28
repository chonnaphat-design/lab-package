# Table

**Purpose:** Rows and columns of data people compare across, such as a list of payments with date, status and amount.

## When to use

- **Data with the same fields for every item,** where people scan down a column or compare across a row.
- **Numbers to compare,** such as amounts, with a total in the footer.
- **A data table:** a table people can sort, filter, select rows in and page through. Build it from this Table and TanStack Table in your app; see [Data-table recipe](#data-table-recipe).

## When not to use

| Instead of a table for…                                          | Use                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| Laying out a page or a form in columns                           | CSS grid or flex. Tables are for data only.               |
| A few items with different fields, or one item's details         | Cards, or a list of label and value pairs.                |
| A spreadsheet people edit cell by cell with the arrow keys       | A grid widget. TODO: the package has none.                |
| A list where each item is one link                               | A list (`ul`) of links, or Cards.                         |
| A trend over time                                                | Chart, with the table as an alternative view if needed.   |

## Writing the table

- **Give it a caption** that says what the table holds, such as "Payments in June 2026". It names the table for screen readers, and shows above the table on the left, like a heading.
- **Make every column header a `TableHead` with `scope="col"`.** A row's label in its first cell, or "Total" in the footer, is a `TableHead` with `scope="row"`.
- **Right-align numbers and their header,** and use `tabular-nums` so the digits line up.
- **Leave empty cells empty.** Avoid "-" or "x", which screen readers read out.
- **Keep it a plain table.** Don't add `role="grid"`. Checkboxes, buttons and links in cells work as they are.
- **Don't make a whole row clickable.** Put a real link or button in one cell, such as the first, naming the item.

## Import and use

Install the package, then import its stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install @chonny_iamsrithong/lab-package
```

```tsx
import "@chonny_iamsrithong/lab-package/styles.css"
```

Then import the parts you use:

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@chonny_iamsrithong/lab-package"

<Table>
  <TableCaption>Payments in June 2026</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Description</TableHead>
      <TableHead scope="col" className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Rent</TableCell>
      <TableCell className="text-right tabular-nums">-$1,450.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

- Table ships with `"use client"`, so you can render it from a Server Component and pass it data. A data table with sorting or selection keeps state, so its file needs `"use client"`.

## Props and variants

Table has **no `variant` or `size` props**. Header cells are 48px tall, body cells have 12px padding, and text is 14px.

| Part           | What it is                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `Table`        | The table, inside a container that scrolls sideways when the table is too wide. Takes every `table` prop, such as `aria-label`. |
| `TableCaption` | The table's name, shown above the table. Put it first inside `Table`.                          |
| `TableHeader`  | The header rows (`thead`).                                                                     |
| `TableBody`    | The data rows (`tbody`).                                                                       |
| `TableFooter`  | Summary rows such as a total (`tfoot`), on a light grey background.                            |
| `TableRow`     | A row. Rows highlight on hover. Give a selected row `data-state="selected"`.                   |
| `TableHead`    | A header cell (`th`). Give it `scope="col"` or `scope="row"`.                                  |
| `TableCell`    | A data cell (`td`). Use `colSpan` to span columns.                                             |

Every part takes `className` for one-off tweaks.

### Wide tables

When the table is wider than its container, it scrolls sideways. While it scrolls, the container can be reached with Tab, so keyboard users can scroll it with the arrow keys. It shows a dark outline on focus, and screen readers announce it as a region named by the caption, or by the table's `aria-label` if it has no caption. See the `Scrolling` story.

Cells don't wrap, so long text widens the column. For a column of long text, add `className="whitespace-normal"` to its cells.

TODO: no sticky header or sticky first column yet.

### Selected rows

`data-state="selected"` gives a row a grey background. The colour alone doesn't tell everyone, so also show selection with a ticked Checkbox in the row, labelled with the row's name, such as "Select Rent". See the `SelectedRow` story.

### States

| State    | How it is set              | Look                    |
| -------- | -------------------------- | ----------------------- |
| Default  | default                    | Thin line between rows  |
| Hover    | pointer over a row         | Light grey background   |
| Selected | `data-state="selected"`    | Grey background         |
| Scroll focus | Tab, while it scrolls  | Dark outline around the table |

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Data-table recipe

The `DataTable` story builds a data table from this Table and [TanStack Table](https://tanstack.com/table), with our Checkbox, Input, Button and Badge. Copy its source from Storybook. TanStack Table is not part of this package; install it in your app:

```bash
npm install @tanstack/react-table
```

What the recipe does, and what to keep if you change it:

- **Sorting.** The header of a sortable column holds a ghost `Button` with the column name and an arrow icon. The icon is hidden from screen readers. The sorted column's `TableHead` gets `aria-sort="ascending"` or `"descending"`; other headers get none.
- **Filter.** A search `Input` with a visible label, "Filter payments". When nothing matches, one row spans every column and says so, such as "No payments match "zzz"."
- **Row selection.** Each row has a Checkbox labelled with the row, such as "Select Rent", and the selected row gets `data-state="selected"`. The header Checkbox, "Select all on this page", is partly ticked while only some rows are.
- **Pagination.** "Previous page" and "Next page" buttons in a `nav` named "Pagination", 5 rows per page. Each button is disabled at its end.
- **Status line.** One line with `role="status"`, such as "2 of 12 selected · Showing 1–5 of 12 · Sorted by amount, ascending". Screen readers announce it when the filter, page, selection or sort changes.

TODO: no column visibility menu, row actions menu or loading state yet.

## Contrast

| What                                     | Light | Dark  | Needs |
| ---------------------------------------- | ----- | ----- | ----- |
| Cell and header text                     | 19.59 | 18.90 | 4.5   |
| Text in a selected row                   | 17.76 | 13.78 | 4.5   |
| Caption                                  | 5.27  | 8.43  | 4.5   |
| Scroll focus outline against the page    | 5.25  | 4.60  | 3     |

axe (WCAG 2.2 AA) passes every story.

## Tokens used

| Token                | Used for                                                   |
| -------------------- | ---------------------------------------------------------- |
| `--foreground`       | Header and cell text                                       |
| `--muted-foreground` | Caption                                                    |
| `--muted`            | Hover and selected row background, and the footer at 50%  |
| `--border`           | Lines between rows and above the footer                    |
| `--ring`             | Scroll focus outline                                       |

## Example

The `Playground` story:

```tsx
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@chonny_iamsrithong/lab-package"

<Table>
  <TableCaption>Payments in June 2026</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Date</TableHead>
      <TableHead scope="col">Description</TableHead>
      <TableHead scope="col">Status</TableHead>
      <TableHead scope="col" className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>2026-06-03</TableCell>
      <TableCell>Salary</TableCell>
      <TableCell>
        <Badge variant="secondary">Paid</Badge>
      </TableCell>
      <TableCell className="text-right tabular-nums">$3,200.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>2026-06-05</TableCell>
      <TableCell>Electricity bill</TableCell>
      <TableCell>
        <Badge variant="outline">Pending</Badge>
      </TableCell>
      <TableCell className="text-right tabular-nums">-$182.40</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableHead scope="row" colSpan={3}>Total</TableHead>
      <TableCell className="text-right tabular-nums">$3,017.60</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```
