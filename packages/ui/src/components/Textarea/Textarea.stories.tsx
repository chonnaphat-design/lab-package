import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "./Textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    "aria-label": "Payment note",
    placeholder: "Add a note…",
    invalid: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    invalid: {
      control: "boolean",
      description: "Error state. Sets `aria-invalid`.",
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    placeholder: { control: "text" },
    rows: { control: "number" },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** Change invalid, disabled, read-only, rows and placeholder with the controls. */
export const Playground: Story = {}

/** Real usage: a visible label tied to the textarea with `htmlFor` / `id`. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <label htmlFor="textarea-note" className="text-sm font-medium">
        Note to recipient
      </label>
      <Textarea {...args} id="textarea-note" aria-label={undefined} />
    </div>
  ),
}

/** `rows` sets the starting height, to hint at how long an answer you expect. It still grows, up to a cap, then scrolls. */
export const LongAnswer: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <label htmlFor="textarea-problem" className="text-sm font-medium">
        Describe the problem
      </label>
      <Textarea {...args} id="textarea-problem" aria-label={undefined} placeholder={undefined} rows={6} />
    </div>
  ),
}

const states = [
  { name: "Empty", props: { placeholder: "Add a note…" } },
  { name: "Filled", props: { defaultValue: "Invoice #4821, paid in full." } },
  { name: "Invalid", props: { defaultValue: "Too long", invalid: true } },
  { name: "Disabled", props: { placeholder: "Disabled", disabled: true } },
  { name: "Read-only", props: { defaultValue: "Invoice #4821, paid in full.", readOnly: true } },
]

/** Every state side by side. Focus is checked by tabbing into a field. */
export const States: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {states.map((state) => (
        <div key={state.name} className="grid gap-1.5">
          <label
            htmlFor={`textarea-${state.name}`}
            className="text-sm font-medium text-muted-foreground"
          >
            {state.name}
          </label>
          <Textarea
            {...args}
            placeholder={undefined}
            aria-label={undefined}
            invalid={false}
            {...state.props}
            id={`textarea-${state.name}`}
          />
        </div>
      ))}
    </div>
  ),
}

/** The same states under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark grid gap-3 rounded-2xl bg-background p-6 text-foreground">
      <Textarea {...args} aria-label="Dark empty" />
      <Textarea {...args} aria-label="Dark filled" defaultValue="Invoice #4821, paid in full." />
      <Textarea {...args} aria-label="Dark invalid" defaultValue="Too long" invalid />
      <Textarea {...args} aria-label="Dark disabled" disabled />
    </div>
  ),
}
