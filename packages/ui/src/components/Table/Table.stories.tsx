import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"

import { Badge } from "../Badge"
import { Button } from "../Button"
import { Checkbox } from "../Checkbox"
import { Input } from "../Input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table"

type Payment = {
  id: string
  date: string
  description: string
  status: "Paid" | "Pending" | "Failed"
  amount: number
}

const payments: Payment[] = [
  { id: "p1", date: "2026-06-02", description: "Coffee Corner", status: "Paid", amount: -4.5 },
  { id: "p2", date: "2026-06-03", description: "Salary", status: "Paid", amount: 3200 },
  { id: "p3", date: "2026-06-05", description: "Electricity bill", status: "Pending", amount: -182.4 },
  { id: "p4", date: "2026-06-08", description: "Rent", status: "Paid", amount: -1450 },
  { id: "p5", date: "2026-06-09", description: "Gym membership", status: "Failed", amount: -39.99 },
  { id: "p6", date: "2026-06-12", description: "Refund: headphones", status: "Paid", amount: 129 },
  { id: "p7", date: "2026-06-15", description: "Groceries", status: "Paid", amount: -86.2 },
  { id: "p8", date: "2026-06-18", description: "Phone plan", status: "Pending", amount: -45 },
  { id: "p9", date: "2026-06-21", description: "Dinner out", status: "Paid", amount: -72.3 },
  { id: "p10", date: "2026-06-24", description: "Insurance", status: "Paid", amount: -210 },
  { id: "p11", date: "2026-06-27", description: "Transfer from savings", status: "Paid", amount: 500 },
  { id: "p12", date: "2026-06-30", description: "Bookshop", status: "Paid", amount: -24.95 },
]

const money = (value: number) =>
  value.toLocaleString("en-AU", { style: "currency", currency: "AUD" })

const statusVariant = { Paid: "secondary", Pending: "outline", Failed: "danger" } as const

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Styled table parts: `Table` → `TableCaption`, `TableHeader` / `TableBody` / `TableFooter` → `TableRow` → `TableHead` / `TableCell`. For sorting, filtering, selection and pagination, see the `DataTable` story: a recipe built with TanStack Table in your app.",
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/** A plain table: caption, column headers with `scope`, amounts right-aligned, a total in the footer. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-[40rem] max-w-full">
      <Table {...args}>
        <TableCaption>Payments in June 2026</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Date</TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.slice(0, 5).map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[payment.status]}>{payment.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{money(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead scope="row" colSpan={3}>
              Total
            </TableHead>
            <TableCell className="text-right tabular-nums">
              {money(payments.slice(0, 5).reduce((sum, payment) => sum + payment.amount, 0))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}

/** `data-state="selected"` on a row gives it the selected background. Selection is also shown by its ticked checkbox. */
export const SelectedRow: Story = {
  render: (args) => (
    <div className="w-[32rem] max-w-full">
      <Table {...args}>
        <TableCaption>Choose payments to export</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-10">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.slice(0, 3).map((payment, index) => (
            <TableRow key={payment.id} data-state={index === 1 ? "selected" : undefined}>
              <TableCell>
                <Checkbox defaultChecked={index === 1} aria-label={`Select ${payment.description}`} />
              </TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell className="text-right tabular-nums">{money(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

/** A sortable column header: a button inside the `th`, with `aria-sort` on the `th` while it's sorted. */
function SortHeader({
  label,
  sorted,
  onSort,
  align = "left",
}: {
  label: string
  sorted: false | "asc" | "desc"
  onSort: () => void
  align?: "left" | "right"
}) {
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSort}
      className={align === "right" ? "-mr-3 ml-auto" : "-ml-3"}
    >
      {label}
      <Icon data-icon="inline-end" aria-hidden />
    </Button>
  )
}

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.description}`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortHeader label="Date" sorted={column.getIsSorted()} onSort={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortHeader label="Amount" align="right" sorted={column.getIsSorted()} onSort={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => <div className="text-right tabular-nums">{money(row.original.amount)}</div>,
  },
]

const sortLabel = (columnId: string) => (columnId === "amount" ? "amount" : "date")

const ariaSort = (sorted: false | "asc" | "desc") =>
  sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined

/**
 * The data-table recipe, built with TanStack Table (`@tanstack/react-table`, installed in your app)
 * and our Table, Checkbox, Input and Button: sortable columns, a labelled filter, row selection
 * with Select all, and pagination. The result count is announced to screen readers.
 */
export const DataTable: Story = {
  render: () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [filter, setFilter] = React.useState("")
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
      data: payments,
      columns,
      state: { sorting, globalFilter: filter, rowSelection },
      onSortingChange: setSorting,
      onGlobalFilterChange: setFilter,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 5 } },
    })
    const { pageIndex, pageSize } = table.getState().pagination
    const total = table.getFilteredRowModel().rows.length
    const first = total === 0 ? 0 : pageIndex * pageSize + 1
    const last = Math.min(total, (pageIndex + 1) * pageSize)
    const selected = table.getFilteredSelectedRowModel().rows.length
    const sortedBy = sorting[0]
      ? ` · Sorted by ${sortLabel(sorting[0].id)}, ${sorting[0].desc ? "descending" : "ascending"}`
      : ""

    return (
      <div className="grid w-[46rem] max-w-full gap-4">
        <div className="grid max-w-72 gap-2">
          <label htmlFor="payments-filter" className="text-sm font-medium">
            Filter payments
          </label>
          <Input
            id="payments-filter"
            type="search"
            placeholder="Coffee"
            value={filter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        </div>
        <Table>
          <TableCaption>Payments in June 2026</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={ariaSort(header.column.getIsSorted())}
                    className={header.column.id === "amount" ? "text-right" : undefined}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No payments match "{filter}".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground" role="status">
            {selected} of {total} selected · Showing {first}–{last} of {total}
            {sortedBy}
          </p>
          <nav aria-label="Pagination" className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous page
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next page
            </Button>
          </nav>
        </div>
      </div>
    )
  },
}

/**
 * When the table is wider than its container it scrolls sideways. The container can then be
 * reached with Tab, so keyboard users can scroll it with the arrow keys, and screen readers
 * announce it as a region named by the caption.
 */
export const Scrolling: Story = {
  render: (args) => (
    <div className="w-80 max-w-full">
      <Table {...args}>
        <TableCaption>Payments in June 2026</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Date</TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.slice(0, 4).map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[payment.status]}>{payment.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{money(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

/** Under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark w-[40rem] max-w-full rounded-2xl bg-background p-6 text-foreground">
      <Table {...args}>
        <TableCaption>Payments in June 2026</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.slice(0, 4).map((payment, index) => (
            <TableRow key={payment.id} data-state={index === 2 ? "selected" : undefined}>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[payment.status]}>{payment.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{money(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}
