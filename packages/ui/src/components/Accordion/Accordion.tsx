import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "../../lib/utils"

import styles from "./Accordion.module.css"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(styles.item, className)}
      {...props}
    />
  )
}

/** The item's heading and the button that opens it. Renders inside an <h3> by default. */
function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className={styles.header}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(styles.trigger, className)}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          aria-hidden
          className={cn(styles.icon, styles.iconClosed)}
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          aria-hidden
          className={cn(styles.icon, styles.iconOpen)}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/** The panel. `className` styles the inner wrapper, as in shadcn. */
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={styles.content}
      {...props}
    >
      <div className={cn(styles.contentInner, className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
