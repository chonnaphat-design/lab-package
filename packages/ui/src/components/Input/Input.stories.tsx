import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "./Input"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    "aria-label": "Email address",
    placeholder: "name@acme.com",
    type: "email",
    invalid: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    invalid: {
      control: "boolean",
      description: "Error state. Sets `aria-invalid`.",
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    placeholder: { control: "text" },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** Change type, invalid, disabled, read-only and placeholder with the controls. */
export const Playground: Story = {}

/** Real usage: a visible label tied to the input with `htmlFor` / `id`. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <label htmlFor="input-email" className="text-sm font-medium">
        Work email
      </label>
      <Input {...args} id="input-email" aria-label={undefined} />
    </div>
  ),
}

const states = [
  { name: "Empty", props: { placeholder: "name@acme.com" } },
  { name: "Filled", props: { defaultValue: "finance@acme.com" } },
  { name: "Invalid", props: { defaultValue: "finance@", invalid: true } },
  { name: "Disabled", props: { placeholder: "Disabled", disabled: true } },
  { name: "Read-only", props: { defaultValue: "acme.com/inv/4821", readOnly: true } },
]

/** Every state side by side. Focus is checked by tabbing into a field. */
export const States: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {states.map((state) => (
        <div key={state.name} className="grid gap-1.5">
          <label
            htmlFor={`input-${state.name}`}
            className="text-sm font-medium text-muted-foreground"
          >
            {state.name}
          </label>
          <Input
            {...args}
            placeholder={undefined}
            aria-label={undefined}
            invalid={false}
            {...state.props}
            id={`input-${state.name}`}
          />
        </div>
      ))}
    </div>
  ),
}

/** Native input types, including the styled file picker. */
export const Types: Story = {
  render: () => (
    <div className="grid gap-3">
      <Input aria-label="Name" type="text" placeholder="Text" />
      <Input aria-label="Password" type="password" defaultValue="hunter22" />
      <Input aria-label="Amount" type="number" placeholder="0.00" />
      <Input aria-label="Search" type="search" placeholder="Search" />
      <Input aria-label="Receipt" type="file" />
    </div>
  ),
}

/** The same states under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark grid gap-3 rounded-2xl bg-background p-6 text-foreground">
      <Input {...args} aria-label="Dark empty" />
      <Input {...args} aria-label="Dark filled" defaultValue="finance@acme.com" />
      <Input {...args} aria-label="Dark invalid" defaultValue="finance@" invalid />
      <Input {...args} aria-label="Dark disabled" disabled />
    </div>
  ),
}
