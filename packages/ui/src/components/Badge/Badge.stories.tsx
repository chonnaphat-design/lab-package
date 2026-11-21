import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRightIcon, CheckIcon, ClockIcon } from "lucide-react"

import { Badge, type BadgeVariant } from "./Badge"

const variants: BadgeVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "link",
]

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Paid",
    variant: "primary",
  },
  argTypes: {
    variant: { control: "select", options: variants },
    children: { control: "text" },
    className: { control: "text" },
    render: { control: false },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** Change variant and text with the controls. */
export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

/** Typical status labels from the finance dashboard. */
export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Paid</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="ghost">Archived</Badge>
      <Badge variant="danger">Overdue</Badge>
    </div>
  ),
}

/** `data-icon="inline-start" | "inline-end"` tightens the padding on that side. */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args}>
        <CheckIcon data-icon="inline-start" /> Paid
      </Badge>
      <Badge {...args} variant="secondary">
        <ClockIcon data-icon="inline-start" /> Pending
      </Badge>
      <Badge {...args} variant="outline">
        Statement <ArrowUpRightIcon data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

/**
 * `render` turns the badge into a link. Hover styles apply only to links
 * (`[a]:hover`), so hover these to check them.
 */
export const AsLinks: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Badge
          key={variant}
          {...args}
          variant={variant}
          render={<a href={`#${variant}`} />}
        >
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

/** `aria-invalid` adds a destructive border and ring. */
export const Invalid: Story = {
  args: { "aria-invalid": true, variant: "outline", children: "Missing" },
}

/** The same variants under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark flex flex-wrap items-center gap-2 rounded-2xl bg-background p-6 text-foreground">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}
