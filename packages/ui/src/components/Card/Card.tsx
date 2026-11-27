import * as React from "react"

import { cn } from "../../lib/utils"

import styles from "./Card.module.css"

export type CardSize = "sm" | "md"

export type CardProps = React.ComponentProps<"div"> & {
  /** Padding and gap: 24px (md) or 16px (sm). @default "md" */
  size?: CardSize
}

/** A container that groups content and actions about one subject. */
function Card({ className, size = "md", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(styles.header, className)}
      {...props}
    />
  )
}

/** The card's title. It is a div: put a heading element inside it, at the level that fits the page. */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(styles.title, className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(styles.description, className)}
      {...props}
    />
  )
}

/** A slot in the header's top-right corner, for a button or menu. */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(styles.action, className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(styles.content, className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(styles.footer, className)}
      {...props}
    />
  )
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
