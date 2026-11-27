"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "../../lib/utils"

import styles from "./Avatar.module.css"

export type AvatarSize = "sm" | "md" | "lg"

export type AvatarProps = AvatarPrimitive.Root.Props & {
  /** 24px (sm), 32px (md) or 40px (lg). @default "md" */
  size?: AvatarSize
}

/** A person's picture, or their initials while it loads or if there is none. */
function Avatar({ className, size = "md", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(styles.image, className)}
      {...props}
    />
  )
}

/** Shown until the image loads, or if it fails: initials or an icon. */
function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(styles.fallback, className)}
      {...props}
    />
  )
}

/** A small dot in the bottom-right corner, such as an online status. Give it a text alternative. */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(styles.badge, className)}
      {...props}
    />
  )
}

/** Overlapping avatars, such as the people on an account. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(styles.group, className)}
      {...props}
    />
  )
}

/** The "+3" circle at the end of a group. */
function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(styles.count, className)}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
