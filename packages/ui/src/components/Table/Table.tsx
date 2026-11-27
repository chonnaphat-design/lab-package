"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

import styles from "./Table.module.css"

/** Lets the scroll container name itself after the table's caption. */
const TableCaptionContext = React.createContext<((id: string | null) => void) | null>(null)

/**
 * A table in a container that scrolls sideways when the table is too wide.
 * While it scrolls, the container can be focused (so keyboard users can scroll it)
 * and is a region named by the caption, or by the table's `aria-label`.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = React.useState(false)
  const [captionId, setCaptionId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const check = () => setOverflows(container.scrollWidth > container.clientWidth + 1)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(container)
    if (container.firstElementChild) observer.observe(container.firstElementChild)
    return () => observer.disconnect()
  }, [])

  const label = props["aria-label"]
  const named = Boolean(captionId || label)

  return (
    <TableCaptionContext.Provider value={setCaptionId}>
      <div
        ref={containerRef}
        data-slot="table-container"
        className={styles.container}
        tabIndex={overflows ? 0 : undefined}
        role={overflows && named ? "region" : undefined}
        aria-labelledby={overflows && captionId ? captionId : undefined}
        aria-label={overflows && !captionId ? label : undefined}
      >
        <table
          data-slot="table"
          className={cn(styles.root, className)}
          {...props}
        />
      </div>
    </TableCaptionContext.Provider>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(styles.header, className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(styles.body, className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(styles.footer, className)}
      {...props}
    />
  )
}

/** A row. Set `data-state="selected"` on a selected row. */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(styles.row, className)}
      {...props}
    />
  )
}

/** A header cell (`th`). Give it `scope="col"`, or `scope="row"` in a row. */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(styles.head, className)}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(styles.cell, className)}
      {...props}
    />
  )
}

function TableCaption({ className, id, ...props }: React.ComponentProps<"caption">) {
  const setCaptionId = React.useContext(TableCaptionContext)
  const generatedId = React.useId()
  const captionId = id ?? generatedId

  React.useEffect(() => {
    if (!setCaptionId) return
    setCaptionId(captionId)
    return () => setCaptionId(null)
  }, [setCaptionId, captionId])

  return (
    <caption
      data-slot="table-caption"
      id={captionId}
      className={cn(styles.caption, className)}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
