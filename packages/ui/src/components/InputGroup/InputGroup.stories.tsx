import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowUpIcon,
  CopyIcon,
  MailIcon,
  PaperclipIcon,
  SearchIcon,
} from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./InputGroup"

const meta = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description:
        "Disables the control and every button inside, and dims the addons.",
    },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Icon addon at the start, button at the end. Toggle `disabled`: it reaches the input and the button. */
export const Playground: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search transactions" placeholder="Search" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

/** `InputGroupText` for fixed prefixes and suffixes. */
export const WithText: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Amount" placeholder="0.00" inputMode="decimal" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupAddon>
          <MailIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput aria-label="Work email" placeholder="finance" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@acme.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

/** `InputGroupButton` defaults to ghost, size xs. Icon-only needs an `aria-label`. */
export const WithButtons: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <InputGroup {...args}>
        <InputGroupInput
          aria-label="Invoice link"
          readOnly
          defaultValue="acme.com/inv/4821"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton iconOnly aria-label="Copy link">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput aria-label="Promo code" placeholder="Promo code" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary" size="sm">
            Apply
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

/** `block-start` / `block-end` addons stack above or below a textarea. */
export const WithTextarea: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText>Note to recipient</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea aria-label="Note to recipient" placeholder="Add a note…" />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupButton iconOnly aria-label="Attach file">
          <PaperclipIcon />
        </InputGroupButton>
        <InputGroupButton
          variant="primary"
          iconOnly
          aria-label="Send"
          className="ml-auto"
        >
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

/** Invalid comes from the control (`invalid`); the group picks it up with `:has()`. */
export const States: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Default</span>
        <InputGroup>
          <InputGroupAddon>
            <MailIcon aria-hidden />
          </InputGroupAddon>
          <InputGroupInput aria-label="Default email" placeholder="finance" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>@acme.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="grid gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Invalid</span>
        <InputGroup>
          <InputGroupAddon>
            <MailIcon aria-hidden />
          </InputGroupAddon>
          <InputGroupInput aria-label="Invalid email" invalid defaultValue="finance@" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>@acme.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="grid gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Disabled</span>
        <InputGroup disabled>
          <InputGroupAddon>
            <MailIcon aria-hidden />
          </InputGroupAddon>
          <InputGroupInput aria-label="Disabled email" placeholder="finance" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>@acme.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  ),
}

/** The same groups under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: () => (
    <div className="dark grid gap-3 rounded-2xl bg-background p-6 text-foreground">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput aria-label="Dark search" placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <MailIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput aria-label="Dark invalid email" invalid defaultValue="finance@" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@acme.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
