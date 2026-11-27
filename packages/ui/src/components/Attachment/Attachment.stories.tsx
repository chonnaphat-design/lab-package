import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CheckIcon,
  ClockIcon,
  FileTextIcon,
  FileWarningIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  SheetIcon,
  XIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  type AttachmentState,
} from "./Attachment"

/** A local placeholder image, so stories don't load anything from the network. */
function thumbnail(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="160" height="160" fill="url(#g)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const states: {
  state: AttachmentState
  icon: React.ReactNode
  name: string
  detail: string
  short: string
}[] = [
  { state: "idle", icon: <ClockIcon />, name: "selected-file.pdf", detail: "Ready to upload", short: "Ready" },
  {
    state: "uploading",
    icon: <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />,
    name: "q3-statement.pdf",
    detail: "Uploading · 64%",
    short: "Uploading",
  },
  { state: "processing", icon: <FileTextIcon />, name: "invoice-4821.pdf", detail: "Checking the file", short: "Checking" },
  { state: "error", icon: <FileWarningIcon />, name: "budget-2026.xlsx", detail: "Upload failed. Try again.", short: "Failed" },
  { state: "done", icon: <CheckIcon />, name: "receipt-0412.pdf", detail: "Uploaded · 1.8 MB", short: "Done" },
]

const meta = {
  title: "Components/Attachment",
  component: Attachment,
  tags: ["autodocs"],
  args: {
    state: "done",
    size: "md",
    orientation: "horizontal",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["idle", "uploading", "processing", "error", "done"],
    },
    size: { control: "inline-radio", options: ["xs", "sm", "md"] },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj<typeof meta>

/** One file. Change state, size and orientation with the controls. */
export const Playground: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>q3-statement.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove q3-statement.pdf">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

/** Files in a list, full width, each with a Remove button named after the file. */
export const Files: Story = {
  render: (args) => (
    <div className="grid gap-2">
      {[
        { icon: <FileTextIcon />, name: "q3-statement.pdf", detail: "PDF · 2.4 MB" },
        { icon: <SheetIcon />, name: "payees-import.csv", detail: "CSV · 18 KB" },
      ].map((file) => (
        <Attachment key={file.name} {...args} className="w-full">
          <AttachmentMedia>{file.icon}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.detail}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${file.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}

/** Every state as a row. Failed uploads get a Retry button as well as Remove. */
export const States: Story = {
  render: (args) => (
    <div className="grid gap-2">
      {states.map((item) => (
        <Attachment key={item.state} {...args} state={item.state} className="w-full">
          <AttachmentMedia>{item.icon}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{item.name}</AttachmentTitle>
            <AttachmentDescription>{item.detail}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {item.state === "error" && (
              <AttachmentAction aria-label={`Retry ${item.name}`}>
                <RefreshCwIcon />
              </AttachmentAction>
            )}
            <AttachmentAction aria-label={`Remove ${item.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}

/** Vertical tiles in a group that scrolls sideways and snaps to each tile. */
export const VerticalGroup: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <AttachmentGroup>
      {states.map((item) => (
        <Attachment key={item.state} {...args} state={item.state}>
          <AttachmentMedia>{item.icon}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{item.name}</AttachmentTitle>
            <AttachmentDescription>{item.short}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${item.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
}

/** Image thumbnails. They show at 60% until the upload is done. */
export const Images: Story = {
  render: (args) => (
    <div className="grid gap-2">
      {[
        { name: "receipt-photo.png", detail: "PNG · 820 KB", state: "done" as const, colors: ["#c3e88d", "#4f7a28"] },
        { name: "id-front.jpg", detail: "Uploading · 30%", state: "uploading" as const, colors: ["#bcd4e6", "#3b6e8f"] },
      ].map((file) => (
        <Attachment key={file.name} {...args} state={file.state} className="w-full">
          <AttachmentMedia variant="image">
            <img src={thumbnail(file.colors[0], file.colors[1])} alt="" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.detail}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${file.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}

/** `xs`, `sm` and `md`. */
export const Sizes: Story = {
  render: (args) => (
    <div className="grid justify-items-start gap-2">
      {(["xs", "sm", "md"] as const).map((size) => (
        <Attachment key={size} {...args} size={size}>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>q3-statement.pdf</AttachmentTitle>
            <AttachmentDescription>Size {size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove q3-statement.pdf (${size})`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}

/**
 * `AttachmentTrigger` stretches a link or button over the card to open the file.
 * The Remove button stays on top and works on its own.
 */
export const WithTrigger: Story = {
  render: (args) => (
    <Attachment {...args} className="w-full">
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>q3-statement.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove q3-statement.pdf">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
      <AttachmentTrigger render={<a href="#q3-statement" aria-label="Open q3-statement.pdf" />} />
    </Attachment>
  ),
}

/** The same states under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark grid gap-2 rounded-2xl bg-background p-6 text-foreground">
      {states.map((item) => (
        <Attachment key={item.state} {...args} state={item.state} className="w-full">
          <AttachmentMedia>{item.icon}</AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{item.name}</AttachmentTitle>
            <AttachmentDescription>{item.detail}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${item.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}
