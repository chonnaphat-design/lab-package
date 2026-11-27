import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "../Button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion"

const faqs = [
  {
    value: "transfers",
    question: "How long do transfers take?",
    answer:
      "Transfers between your own accounts arrive instantly. Payments to other banks usually arrive within one business day.",
  },
  {
    value: "cancel",
    question: "Can I cancel a scheduled payment?",
    answer:
      "Yes, until 5pm the day before it's due. Open the payment from Scheduled and choose Cancel payment.",
  },
  {
    value: "statements",
    question: "Where can I find my statements?",
    answer:
      "Statements for the last 7 years are under Accounts, then Statements. You can download each one as a PDF.",
  },
]

function FaqItems({ disabledValue }: { disabledValue?: string }) {
  return faqs.map((faq) => (
    <AccordionItem
      key={faq.value}
      value={faq.value}
      disabled={faq.value === disabledValue}
    >
      <AccordionTrigger>{faq.question}</AccordionTrigger>
      <AccordionContent>
        <p>{faq.answer}</p>
      </AccordionContent>
    </AccordionItem>
  ))
}

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: {
    multiple: false,
    disabled: false,
    hiddenUntilFound: false,
  },
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Let more than one item be open at a time.",
    },
    disabled: { control: "boolean", description: "Disable every item." },
    hiddenUntilFound: {
      control: "boolean",
      description: "Let the browser's find-in-page open a closed item that contains a match.",
    },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/** Click a question to open it. Toggle multiple, disabled and find-in-page in the controls. */
export const Playground: Story = {
  render: (args) => (
    <Accordion {...args}>
      <FaqItems />
    </Accordion>
  ),
}

/** `multiple` lets several items stay open; by default opening one closes the other. */
export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => (
    <Accordion {...args} defaultValue={["transfers", "statements"]}>
      <FaqItems />
    </Accordion>
  ),
}

/** `defaultValue` opens items on load. It is always an array of item values. */
export const DefaultOpen: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue={["transfers"]}>
      <FaqItems />
    </Accordion>
  ),
}

/** `disabled` on one item dims it and stops it opening. */
export const DisabledItem: Story = {
  render: (args) => (
    <Accordion {...args}>
      <FaqItems disabledValue="cancel" />
    </Accordion>
  ),
}

/** Panels can hold paragraphs, lists and links. Links are underlined. */
export const RichContent: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue={["fees"]}>
      <AccordionItem value="fees">
        <AccordionTrigger>What fees apply to international payments?</AccordionTrigger>
        <AccordionContent>
          <p>A flat fee of $5 applies to each international payment.</p>
          <ul className="list-disc pl-5">
            <li>No fee for payments under $100.</li>
            <li>Exchange rates are shown before you confirm.</li>
          </ul>
          <p>
            See the full <a href="#fees">fees and charges</a> page.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="limits">
        <AccordionTrigger>Are there daily limits?</AccordionTrigger>
        <AccordionContent>
          <p>You can send up to $10,000 a day. Contact us to raise it.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/** Controlled with `value` and `onValueChange`, here with "Show all" and "Hide all" buttons. */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState<string[]>([])
    const allOpen = open.length === faqs.length
    return (
      <div className="grid gap-3">
        <Button
          variant="link"
          size="sm"
          className="justify-self-start px-0"
          aria-expanded={allOpen}
          onClick={() => setOpen(allOpen ? [] : faqs.map((faq) => faq.value))}
        >
          {allOpen ? "Hide all" : "Show all"}
        </Button>
        <Accordion
          {...args}
          multiple
          value={open}
          onValueChange={(value) => setOpen(value as string[])}
        >
          <FaqItems />
        </Accordion>
      </div>
    )
  },
}

/** The same accordion under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark rounded-2xl bg-background p-6 text-foreground">
      <Accordion {...args} defaultValue={["transfers"]}>
        <FaqItems />
      </Accordion>
    </div>
  ),
}

/** A Tailwind utility in `className` beats the module style without `!important`. */
export const ClassNameOverride: Story = {
  args: { className: "rounded-md border-dashed" },
  render: (args) => (
    <Accordion {...args}>
      <FaqItems />
    </Accordion>
  ),
}
