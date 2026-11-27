import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "../Badge"
import { Button } from "../Button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card"

/** A local placeholder image, so stories don't load anything from the network. */
function banner(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="640" height="320" fill="url(#g)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: { size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Header with a title and description, content, and footer actions.
 * The title holds a real heading. Change the size in the controls.
 */
export const Playground: Story = {
  render: (args) => (
    <Card {...args}>
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
  ),
}

/** `md` has 24px padding and gaps; `sm` has 16px, for dense layouts. */
export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(["md", "sm"] as const).map((size) => (
        <Card key={size} size={size}>
          <CardHeader>
            <CardTitle>
              <h3>Size {size}</h3>
            </CardTitle>
            <CardDescription>Padding and gaps follow the size.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Scheduled payments run at 9am on business days.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

/** `CardAction` sits in the header's top-right corner, here a menu button with a name. */
export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>
          <h3>Savings goal</h3>
        </CardTitle>
        <CardDescription>Holiday fund · due 1 March</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" iconOnly aria-label="More options for Savings goal">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>$1,250 of $3,000 saved.</p>
      </CardContent>
    </Card>
  ),
}

/** An image as the first child runs edge to edge at the top. Decorative, so `alt=""`. */
export const WithImage: Story = {
  render: (args) => (
    <Card {...args}>
      <img src={banner("#c3e88d", "#4f7a28")} alt="" className="aspect-[2/1] w-full object-cover" />
      <CardHeader>
        <CardTitle>
          <h3>Green home loan</h3>
        </CardTitle>
        <CardDescription>A lower rate for energy-efficient homes.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" variant="outline">
          See rates
        </Button>
      </CardFooter>
    </Card>
  ),
}

/** Add `border-b` to the header or `border-t` to the footer for a divider; the spacing matches. */
export const Dividers: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader className="border-b">
        <CardTitle>
          <h3>Recent activity</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2">
          <li className="flex justify-between">
            <span>Coffee Corner</span>
            <span>−$4.50</span>
          </li>
          <li className="flex justify-between">
            <span>Salary</span>
            <span>+$3,200.00</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="border-t">
        <Button size="sm" variant="link" className="px-0">
          See all activity
        </Button>
      </CardFooter>
    </Card>
  ),
}

/** Several cards are a list: `ul` and `li`, each card with a heading at the same level. */
export const CardList: Story = {
  decorators: [
    (Story) => (
      <div className="w-[44rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ul className="grid grid-cols-2 gap-4" aria-label="Accounts">
      {[
        { name: "Everyday", balance: "$4,820.15", status: "Active" },
        { name: "Savings", balance: "$12,040.00", status: "Active" },
      ].map((account) => (
        <li key={account.name} className="grid">
          <Card {...args}>
            <CardHeader>
              <CardTitle>
                <h3>{account.name}</h3>
              </CardTitle>
              <CardAction>
                <Badge variant="secondary">{account.status}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-medium">{account.balance}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  ),
}

/**
 * The whole card opens one thing. The heading is the one link, stretched over
 * the card with a pseudo-element; the card shows the focus ring while the link
 * has keyboard focus. Don't wrap the card in a link.
 */
export const ClickableCard: Story = {
  args: {
    className:
      "relative hover:bg-muted/50 has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-ring",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>
          <h3>
            <a
              href="#everyday"
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              Everyday account
            </a>
          </h3>
        </CardTitle>
        <CardDescription>Account 1234 5678</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium">$4,820.15</p>
      </CardContent>
    </Card>
  ),
}

/** Under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-2xl bg-background p-6 text-foreground">
      <Card {...args}>
        <CardHeader>
          <CardTitle>
            <h3>Everyday account</h3>
          </CardTitle>
          <CardDescription>BSB 062-000 · Account 1234 5678</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-medium">$4,820.15</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Transfer</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}

/** A Tailwind utility in `className` beats the module style without `!important`. */
export const ClassNameOverride: Story = {
  args: { className: "rounded-md shadow-md ring-0" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>
          <h3>Overridden</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Square-ish corners, a shadow instead of the ring.</p>
      </CardContent>
    </Card>
  ),
}
