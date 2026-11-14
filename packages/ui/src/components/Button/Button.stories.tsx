import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, CopyIcon, PlusIcon } from "lucide-react"
import { fn } from "storybook/test"

import { Button, type ButtonSize, type ButtonVariant } from "./Button"

const variants: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "link",
]
const sizes: ButtonSize[] = ["xs", "sm", "md", "lg"]

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    iconOnly: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
    iconOnly: {
      control: "boolean",
      description: "Square button for one icon. Pair with `aria-label`.",
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
    render: { control: false },
    className: { control: "text" },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop is a control: change variant, size, iconOnly, disabled and text. */
export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
}

/** `data-icon="inline-start" | "inline-end"` tightens the padding on that side. */
export const WithIcons: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <Button {...args} size={size}>
            <PlusIcon data-icon="inline-start" /> New transfer
          </Button>
          <Button {...args} size={size} variant="outline">
            Continue <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      ))}
    </div>
  ),
}

export const IconOnly: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <Button
          key={size}
          {...args}
          size={size}
          iconOnly
          aria-label={`Copy link (${size})`}
        >
          <CopyIcon />
        </Button>
      ))}
    </div>
  ),
}

type StateColumn = {
  name: string
  /** Props that put the button in this state for real. */
  props?: Record<string, unknown>
}

const states: StateColumn[] = [
  { name: "default" },
  { name: "disabled", props: { disabled: true } },
  { name: "invalid", props: { "aria-invalid": true } },
  { name: "expanded", props: { "aria-expanded": true } },
]

/**
 * Every variant in every prop-driven state. Hover, focus-visible and active
 * need a real pointer or keyboard: try them on the buttons here.
 */
export const StateMatrix: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <table className="border-separate border-spacing-x-4 border-spacing-y-3 text-sm">
      <thead>
        <tr>
          <th />
          {states.map((state) => (
            <th
              key={state.name}
              scope="col"
              className="text-left font-medium text-muted-foreground"
            >
              {state.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {variants.map((variant) => (
          <tr key={variant}>
            <th
              scope="row"
              className="text-left font-medium text-muted-foreground"
            >
              {variant}
            </th>
            {states.map((state) => (
              <td key={state.name}>
                <Button
                  {...args}
                  {...state.props}
                  variant={variant}
                >
                  Button
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

/** The same variants under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark flex flex-wrap items-center gap-3 rounded-2xl bg-background p-6 text-foreground">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

/** `render` swaps the element; set `nativeButton={false}` when it isn't a <button>. */
export const AsLink: Story = {
  args: {
    variant: "link",
    nativeButton: false,
    render: <a href="#transactions" />,
    children: "View all transactions",
  },
}

/** A Tailwind utility in `className` beats the module style without `!important`. */
export const ClassNameOverride: Story = {
  args: {
    className: "bg-blue-600 px-8 text-white",
    children: "Overridden",
  },
}
