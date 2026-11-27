import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "./Checkbox"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    invalid: false,
  },
  argTypes: {
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean", description: "Partly ticked, such as a Select all with only some ticked." },
    disabled: { control: "boolean" },
    invalid: { control: "boolean", description: "Error state. Sets `aria-invalid`." },
    className: { control: "text" },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** A checkbox inside its label, so the whole label ticks it. Change the state in the controls. */
export const Playground: Story = {
  render: (args) => (
    <label className="flex items-center gap-3 text-sm">
      <Checkbox {...args} />
      Email me my monthly statement
    </label>
  ),
}

/** Two ways to label: wrap it in a `label`, or point `htmlFor` at its `id`. */
export const Labels: Story = {
  render: () => (
    <div className="grid gap-4 text-sm">
      <label className="flex items-center gap-3">
        <Checkbox defaultChecked />
        Wrapped in a label
      </label>
      <div className="flex items-center gap-3">
        <Checkbox id="checkbox-paperless" />
        <label htmlFor="checkbox-paperless">Linked with htmlFor</label>
      </div>
    </div>
  ),
}

/** A hint under the label, linked with `aria-describedby`. */
export const WithHint: Story = {
  render: () => (
    <div className="flex items-start gap-3 text-sm">
      <Checkbox id="checkbox-alerts" aria-describedby="checkbox-alerts-hint" className="mt-0.5" />
      <div className="grid gap-1">
        <label htmlFor="checkbox-alerts" className="font-medium">
          Send low-balance alerts
        </label>
        <span id="checkbox-alerts-hint" className="text-muted-foreground">
          We'll text you when your balance drops below $100.
        </span>
      </div>
    </div>
  ),
}

/** A group in a `fieldset` with a `legend` that asks the question. */
export const Group: Story = {
  render: () => (
    <fieldset className="grid gap-3 text-sm">
      <legend className="mb-1 font-medium">Which notifications do you want?</legend>
      {["Payments received", "Bills due", "Security alerts"].map((option, index) => (
        <label key={option} className="flex items-center gap-3">
          <Checkbox name="notifications" value={option} defaultChecked={index === 2} />
          {option}
        </label>
      ))}
    </fieldset>
  ),
}

/** "Select all" is partly ticked while only some options are. Clicking it ticks them all, then clears them. */
export const SelectAll: Story = {
  render: () => {
    const options = ["Everyday", "Savings", "Credit card"]
    const [selected, setSelected] = React.useState<string[]>(["Savings"])
    const all = selected.length === options.length
    const some = selected.length > 0 && !all
    return (
      <fieldset className="grid gap-3 text-sm">
        <legend className="mb-1 font-medium">Accounts to export</legend>
        <label className="flex items-center gap-3 font-medium">
          <Checkbox
            checked={all}
            indeterminate={some}
            onCheckedChange={() => setSelected(all ? [] : options)}
          />
          Select all
        </label>
        <div className="grid gap-3 pl-7">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3">
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked ? [...current, option] : current.filter((value) => value !== option)
                  )
                }
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    )
  },
}

const states = [
  { name: "Unticked", props: {} },
  { name: "Ticked", props: { defaultChecked: true } },
  { name: "Partly ticked", props: { indeterminate: true } },
  { name: "Invalid", props: { invalid: true } },
  { name: "Disabled", props: { disabled: true } },
  { name: "Disabled, ticked", props: { disabled: true, defaultChecked: true } },
]

/** Every state. Focus is checked by tabbing to a box. */
export const States: Story = {
  render: () => (
    <div className="grid gap-3 text-sm">
      {states.map((state) => (
        <label key={state.name} className="flex items-center gap-3">
          <Checkbox {...state.props} />
          {state.name}
        </label>
      ))}
    </div>
  ),
}

/** The same states under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: () => (
    <div className="dark grid gap-3 rounded-2xl bg-background p-6 text-sm text-foreground">
      {states.map((state) => (
        <label key={state.name} className="flex items-center gap-3">
          <Checkbox {...state.props} />
          {state.name}
        </label>
      ))}
    </div>
  ),
}
