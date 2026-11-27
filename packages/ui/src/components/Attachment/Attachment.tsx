"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { Button, type ButtonProps } from "../Button"
import { cn } from "../../lib/utils"

import styles from "./Attachment.module.css"

export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done"
export type AttachmentSize = "xs" | "sm" | "md"
export type AttachmentOrientation = "horizontal" | "vertical"

export type AttachmentProps = React.ComponentProps<"div"> & {
  /** Upload status of the file. @default "done" */
  state?: AttachmentState
  /** Padding, text and media size. @default "md" */
  size?: AttachmentSize
  /** A row (horizontal) or a tile (vertical). @default "horizontal" */
  orientation?: AttachmentOrientation
}

/** One attached file: media, name, details and actions. */
function Attachment({
  className,
  state = "done",
  size = "md",
  orientation = "horizontal",
  ...props
}: AttachmentProps) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export type AttachmentMediaProps = React.ComponentProps<"div"> & {
  /** A file-type icon, or an image thumbnail. @default "icon" */
  variant?: "icon" | "image"
}

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: AttachmentMediaProps) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(styles.media, className)}
      {...props}
    />
  )
}

function AttachmentContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(styles.content, className)}
      {...props}
    />
  )
}

/** The file name. Truncated with an ellipsis when it doesn't fit. */
function AttachmentTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(styles.title, className)}
      {...props}
    />
  )
}

/** Type and size, or the upload status. */
function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(styles.description, className)}
      {...props}
    />
  )
}

function AttachmentActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(styles.actions, className)}
      {...props}
    />
  )
}

/** A small icon button, such as Remove or Retry. Give it an `aria-label` that names the file. */
function AttachmentAction({
  className,
  variant = "ghost",
  size = "xs",
  iconOnly = true,
  ...props
}: ButtonProps) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant}
      size={size}
      iconOnly={iconOnly}
      className={className}
      {...props}
    />
  )
}

/** Stretches a button or link (via `render`) over the whole card, to open or preview the file. */
function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn(styles.trigger, className),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

/** A row of attachments that scrolls sideways, snapping to each card. */
function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(styles.group, className)}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
}
