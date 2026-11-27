# Chart

**Purpose:** Bar, line and area charts built from Recharts, styled with our tokens, with a matching tooltip and legend.

## When to use

- A trend over time, such as a balance month by month: a line chart.
- Comparing amounts across a few categories or periods, such as income and spending by month: a bar chart.
- How a total builds up over time: a stacked area chart.

## When not to use

| Instead of a chart for…                                       | Use                                                  |
| ------------------------------------------------------------- | ---------------------------------------------------- |
| Exact values people need to read or copy                      | A table                                              |
| One number, such as this month's spending                     | The number, in text, with its change                 |
| Parts of a whole with more than five parts                    | A bar chart, sorted. Keep pie or donut charts to five slices or fewer that add up to a meaningful whole. |
| Values of very different sizes                                | A table                                              |
| Decoration                                                    | Nothing. Leave out 3D, shadows and second axes.      |

**Write the message first,** then pick the chart that shows it.

## Writing the content

- **Title:** state the takeaway, such as "Spending stayed below income every month", not just "Income and spending". The UK government's Analysis Function asks for this.
- **Subtitle:** what is measured, the units and the period, such as "AUD, January to June 2026".
- **Numbers:** a thousands separator, consistent decimals, and the unit in the title, axis or tooltip.
- **Series names:** short, set as `label` in the config. They appear in the tooltip and legend.

## Anatomy

| Part                    | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| **ChartContainer**      | Sizes the chart (16:9 by default), styles Recharts' parts, and sets one colour per series. |
| Recharts' parts         | The chart itself, such as `BarChart`, `Bar`, `XAxis` and `CartesianGrid`, imported from `recharts`. |
| **ChartTooltip**        | Recharts' tooltip. Pass `content={<ChartTooltipContent />}`.                        |
| **ChartTooltipContent** | The tooltip's look: series, colour marker and value.                               |
| **ChartLegend**         | Recharts' legend. Pass `content={<ChartLegendContent />}`.                          |
| **ChartLegendContent**  | The legend's look: a colour square and label per series.                            |

## Import and use

Install the package **and Recharts**, then import the stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install lab-package recharts
```

```tsx
import "lab-package/styles.css"
```

Then import the chart parts from `lab-package` and the chart itself from `recharts`:

```tsx
"use client"

import { Bar, BarChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "lab-package"

const config = {
  income: { label: "Income", color: "var(--chart-2)" },
} satisfies ChartConfig

<ChartContainer config={config}>
  <BarChart accessibilityLayer data={data}>
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="income" fill="var(--color-income)" />
  </BarChart>
</ChartContainer>
```

- **Recharts is a peer dependency.** Your app installs it, so there is exactly one copy. A second copy would break charts.
- Chart ships with `"use client"`. Recharts runs only in the browser, so the file that builds the chart starts with `"use client"` too.
- Each series gets a CSS variable named after its key: `income` becomes `var(--color-income)`.

## Making it accessible

A chart is a picture. Most of what makes it accessible is around it:

- **Put it in a figure with a caption** that gives the title and the takeaway, as every story does with `<figure>` and `<figcaption>`. W3C recommends this.
- **Offer the data as a table,** beside the chart or behind a "Show as table" button. Chartability rates a missing table as critical. TODO: there's no built-in table view.
- **Turn on `accessibilityLayer`** on the Recharts chart; it's on by default in Recharts 3. Then:
  - **Tab** focuses the chart, with the shared focus ring;
  - **Left and Right arrows** move between points;
  - **Enter** toggles the tooltip, and **Esc** hides it;
  - the tooltip is a live region, so screen readers read each point's values as you move.
- **Esc** works because of our fix: Recharts has no Escape handling, and WCAG 1.4.13 asks for one. Moving the pointer or pressing another key brings the tooltip back.
- **Don't rely on colour.** Name series in the legend and tooltip. Label lines directly where you can. Keep to five series or fewer.
- **Motion:** Recharts' entry animation already stops when the user has asked for reduced motion.

## Props and variants

### ChartContainer

| Prop               | Default          | What it does                                                                      |
| ------------------ | ---------------- | --------------------------------------------------------------------------------- |
| `config`           | required         | One entry per series key: `label`, and `color` or `theme: { light, dark }`, plus an optional `icon`. |
| `className`        | none             | Size and shape. The chart is 16:9 by default; set another aspect ratio or a height here. |
| `initialDimension` | `320 × 200`      | The size used before the container is measured.                                   |
| `id`               | generated        | A stable id for the chart's colour styles.                                        |

Use `theme: { light, dark }` when a colour that works on the light page doesn't on the dark one, as the stories do for "Spending".

### ChartTooltipContent

| Prop                          | Default | What it does                                                         |
| ----------------------------- | ------- | -------------------------------------------------------------------- |
| `indicator`                   | `dot`   | The colour marker: `dot`, `line` or `dashed`.                        |
| `hideLabel`                   | `false` | Hides the heading, such as the month.                                |
| `hideIndicator`               | `false` | Hides the colour marker.                                             |
| `labelFormatter`, `formatter` | none    | Format the heading or each value yourself, such as adding "$".       |
| `nameKey`, `labelKey`         | none    | Which data field gives each name or the heading.                     |

Values are shown with the browser's number formatting, in tabular digits.

### ChartLegendContent

| Prop       | Default | What it does                                        |
| ---------- | ------- | --------------------------------------------------- |
| `hideIcon` | `false` | Shows a colour square even when the series has an icon. |
| `nameKey`  | none    | Which data field gives each label.                  |

The legend sits under the chart. Leave it out for a single series, where the title names it. TODO: legend markers are always squares, even for a line chart; Microsoft recommends matching the mark's shape.

### Axes and grid

- **Bar and area charts start at zero.** A line chart may start elsewhere, but say so.
- Grid lines are faint and horizontal only in the stories; keep to about ten.
- **Axis labels are always the muted text colour.** Recharts sets their colour inline, so the stylesheet forces it with `!important`. Changing their colour through Recharts' `tick` prop won't work.

### Colours

The five chart tokens are shades of one olive grey, not distinct hues:

| Token       | Against the light page | Against the dark page |
| ----------- | ---------------------- | --------------------- |
| `--chart-1` | 1.43 ✗                 | 13.67                 |
| `--chart-2` | 4.25                   | 4.60                  |
| `--chart-3` | 6.90                   | 2.84 ✗                |
| `--chart-4` | 9.42                   | 2.08 ✗                |
| `--chart-5` | 14.27                  | 1.37 ✗                |

Chart marks need 3:1 against the page (WCAG 1.4.11), unless the values are also shown as text or in a table.

- **One series:** use `--chart-2`. It passes in both themes.
- **Two series:** `--chart-2` with `theme: { light: "var(--chart-4)", dark: "var(--chart-1)" }`, as the stories do.
- **More series:** neighbouring shades are only 1.37:1 to 2.97:1 apart, too close to tell apart. IBM Carbon, Atlassian and the UK's Office for National Statistics all use distinct hues for categories. A single-hue ramp is meant for ordered data, such as low to high. TODO: decide whether to add a categorical palette.

Dark mode is applied automatically when a `.dark` class is set on a parent element.

## Contrast

| What                          | Light | Dark | Needs |
| ----------------------------- | ----- | ---- | ----- |
| Axis labels                   | 5.27  | 8.43 | 4.5   |
| Focus ring around the chart   | 5.25  | 4.60 | 3     |
| Story series, against the page | 4.25 and 9.42 | 4.60 and 13.67 | 3 |

axe (WCAG 2.2 AA) passes every story, but axe doesn't check chart marks.

## Tokens used

| Token                 | Used for                                               |
| --------------------- | ------------------------------------------------------ |
| `--chart-1` to `--chart-5` | Series colours, set in your `config`             |
| `--muted-foreground`  | Axis labels, and series names in the tooltip           |
| `--border`            | Grid lines (50%), the tooltip's line cursor and border |
| `--muted`             | The bar chart's hover band                             |
| `--background`        | Tooltip background                                     |
| `--foreground`        | Tooltip values                                         |
| `--ring`              | Focus ring around the chart                            |

## Example

The `Playground` story, without its figure and caption:

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "lab-package"

const config = {
  income: { label: "Income", color: "var(--chart-2)" },
  spending: {
    label: "Spending",
    theme: { light: "var(--chart-4)", dark: "var(--chart-1)" },
  },
} satisfies ChartConfig

<ChartContainer config={config}>
  <BarChart accessibilityLayer data={monthly}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
    <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={dollars} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="income" fill="var(--color-income)" radius={4} />
    <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
  </BarChart>
</ChartContainer>
```
