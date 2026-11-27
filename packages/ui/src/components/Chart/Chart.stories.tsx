import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./Chart"

const monthly = [
  { month: "Jan", income: 4200, spending: 3100 },
  { month: "Feb", income: 4200, spending: 3550 },
  { month: "Mar", income: 4600, spending: 2980 },
  { month: "Apr", income: 4200, spending: 3720 },
  { month: "May", income: 4900, spending: 3300 },
  { month: "Jun", income: 4200, spending: 3050 },
]

const balance = [
  { month: "Jan", balance: 8200 },
  { month: "Feb", balance: 8850 },
  { month: "Mar", balance: 10470 },
  { month: "Apr", balance: 10950 },
  { month: "May", balance: 12550 },
  { month: "Jun", balance: 13700 },
]

/**
 * Both series reach 3:1 against the page in both themes. --chart-4 is too dark
 * for the dark page (2.08:1), so spending switches to --chart-1 there (13.67:1).
 */
const incomeConfig = {
  income: { label: "Income", color: "var(--chart-2)" },
  spending: {
    label: "Spending",
    theme: { light: "var(--chart-4)", dark: "var(--chart-1)" },
  },
} satisfies ChartConfig

const balanceConfig = {
  balance: { label: "Balance", color: "var(--chart-3)" },
} satisfies ChartConfig

const dollars = (value: number) => `$${value.toLocaleString()}`

/** The chart's title and takeaway sit above it, as a figure caption. */
function Figure({ title, takeaway, children }: { title: string; takeaway: string; children: React.ReactNode }) {
  return (
    <figure className="grid w-[36rem] max-w-full gap-3">
      <figcaption className="grid gap-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{takeaway}</span>
      </figcaption>
      {children}
    </figure>
  )
}

const meta = {
  title: "Components/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A thin wrapper around Recharts. `ChartContainer` sizes the chart, styles Recharts' parts and turns `config` into one CSS colour per series (`var(--color-<key>)`). Build the chart itself from Recharts' parts inside it.",
      },
    },
  },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

/** Two series as bars, with a tooltip and a legend. Hover or focus the chart and use the arrow keys. */
export const Playground: Story = {
  args: { config: incomeConfig, children: <></> },
  render: () => (
    <Figure title="Income and spending" takeaway="Spending stayed below income every month this year.">
      <ChartContainer config={incomeConfig}>
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
    </Figure>
  ),
}

/** One series over time as a line. */
export const LineChartStory: Story = {
  name: "Line chart",
  args: { config: balanceConfig, children: <></> },
  render: () => (
    <Figure title="Savings balance" takeaway="Up $5,500 since January.">
      <ChartContainer config={balanceConfig}>
        <LineChart accessibilityLayer data={balance} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={dollars} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="balance" type="monotone" stroke="var(--color-balance)" strokeWidth={2} dot />
        </LineChart>
      </ChartContainer>
    </Figure>
  ),
}

/** Stacked areas, with the tooltip's line indicator. */
export const AreaChartStory: Story = {
  name: "Area chart",
  args: { config: incomeConfig, children: <></> },
  render: () => (
    <Figure title="Income and spending" takeaway="The gap between them is what you saved.">
      <ChartContainer config={incomeConfig}>
        <AreaChart accessibilityLayer data={monthly} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area dataKey="income" type="monotone" fill="var(--color-income)" fillOpacity={0.4} stroke="var(--color-income)" />
          <Area dataKey="spending" type="monotone" fill="var(--color-spending)" fillOpacity={0.4} stroke="var(--color-spending)" />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </Figure>
  ),
}

/** The tooltip's three indicator styles: dot (default), line and dashed. Hover each chart. */
export const TooltipIndicators: Story = {
  args: { config: incomeConfig, children: <></> },
  render: () => (
    <div className="grid gap-6">
      {(["dot", "line", "dashed"] as const).map((indicator) => (
        <Figure key={indicator} title={`Indicator: ${indicator}`} takeaway="Hover a month to see the tooltip.">
          <ChartContainer config={incomeConfig} className="aspect-[3/1]">
            <BarChart accessibilityLayer data={monthly}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent indicator={indicator} />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Figure>
      ))}
    </div>
  ),
}

/** Under `.dark`. Series colours can differ per theme with `theme: { light, dark }` in the config. */
export const Dark: Story = {
  args: { config: incomeConfig, children: <></> },
  render: () => (
    <div className="dark rounded-2xl bg-background p-6 text-foreground">
      <Figure title="Income and spending" takeaway="Spending stayed below income every month this year.">
        <ChartContainer config={incomeConfig}>
          <BarChart accessibilityLayer data={monthly}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Figure>
    </div>
  ),
}
