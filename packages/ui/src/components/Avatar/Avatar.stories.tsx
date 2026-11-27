import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./Avatar"

/** A local placeholder "photo", so stories don't load anything from the network. */
function photo(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="16" fill="#fff" fill-opacity=".85"/><path d="M16 96c4-20 18-30 32-30s28 10 32 30z" fill="#fff" fill-opacity=".85"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const people = [
  { name: "Ana Lima", initials: "AL", src: photo("#c3e88d", "#4f7a28") },
  { name: "Ben Okafor", initials: "BO", src: photo("#bcd4e6", "#3b6e8f") },
  { name: "Chloé Martin", initials: "CM", src: photo("#f3c6a5", "#a5592b") },
  { name: "Dev Patel", initials: "DP", src: photo("#d9c2f0", "#6b4a91") },
  { name: "Emi Sato", initials: "ES", src: photo("#f5e39c", "#8f7a1f") },
  { name: "Finn Murphy", initials: "FM", src: photo("#c2ece0", "#2e7f68") },
]

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    className: { control: "text" },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A photo with initials behind it. On its own, the avatar is named as a whole
 * (`role="img"` + `aria-label`), so screen readers hear the name whether the
 * photo or the initials show. Change the size in the controls.
 */
export const Playground: Story = {
  render: (args) => (
    <Avatar {...args} role="img" aria-label="Ana Lima">
      <AvatarImage src={people[0].src} alt="" />
      <AvatarFallback aria-hidden>AL</AvatarFallback>
    </Avatar>
  ),
}

/** `sm` 24px, `md` 32px and `lg` 40px, with photos and with initials. */
export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <Avatar size={size} role="img" aria-label="Ben Okafor">
            <AvatarImage src={people[1].src} alt="" />
            <AvatarFallback aria-hidden>BO</AvatarFallback>
          </Avatar>
          <Avatar size={size} role="img" aria-label="Ben Okafor">
            <AvatarFallback aria-hidden>BO</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
}

/**
 * The fallback shows when there is no image, or the image fails to load.
 * Use initials when you know the name, and an icon when you don't.
 */
export const Fallbacks: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} role="img" aria-label="Chloé Martin">
        <AvatarFallback aria-hidden>CM</AvatarFallback>
      </Avatar>
      <Avatar {...args} role="img" aria-label="Dev Patel">
        <AvatarImage src="data:image/png;base64,broken" alt="" />
        <AvatarFallback aria-hidden>DP</AvatarFallback>
      </Avatar>
      <Avatar {...args} role="img" aria-label="Unknown user">
        <AvatarFallback aria-hidden>
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
}

/** With the name beside it, the picture is decorative: `alt=""`. */
export const WithName: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args}>
        <AvatarImage src={people[2].src} alt="" />
        <AvatarFallback aria-hidden>CM</AvatarFallback>
      </Avatar>
      <div className="grid text-sm leading-tight">
        <span className="font-medium">Chloé Martin</span>
        <span className="text-muted-foreground">Account owner</span>
      </div>
    </div>
  ),
}

/** `AvatarBadge` marks a status. The status is in the avatar's name, and the badge shows an icon at md and lg. */
export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Avatar key={size} size={size} role="img" aria-label="Dev Patel, verified">
          <AvatarImage src={people[3].src} alt="" />
          <AvatarFallback aria-hidden>DP</AvatarFallback>
          <AvatarBadge aria-hidden>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
      ))}
    </div>
  ),
}

/** Overlapping avatars with a "+N" count. The group is labelled and the count says who's hidden. */
export const Group: Story = {
  render: (args) => (
    <AvatarGroup role="group" aria-label="People on this account">
      {people.slice(0, 3).map((person) => (
        <Avatar key={person.name} {...args} role="img" aria-label={person.name}>
          <AvatarImage src={person.src} alt="" />
          <AvatarFallback aria-hidden>{person.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount aria-label="and 3 more: Dev Patel, Emi Sato, Finn Murphy">+3</AvatarGroupCount>
    </AvatarGroup>
  ),
}

/** The same group at every size; the count matches its avatars. */
export const GroupSizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <AvatarGroup key={size} role="group" aria-label={`People on this account (${size})`}>
          {people.slice(0, 3).map((person) => (
            <Avatar key={person.name} size={size} role="img" aria-label={person.name}>
              <AvatarImage src={person.src} alt="" />
              <AvatarFallback aria-hidden>{person.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount aria-label="and 3 more">+3</AvatarGroupCount>
        </AvatarGroup>
      ))}
    </div>
  ),
}

/** Under `.dark`, the class a theme switcher sets on an ancestor. */
export const Dark: Story = {
  render: (args) => (
    <div className="dark flex items-center gap-4 rounded-2xl bg-background p-6 text-foreground">
      <Avatar {...args} role="img" aria-label="Emi Sato">
        <AvatarImage src={people[4].src} alt="" />
        <AvatarFallback aria-hidden>ES</AvatarFallback>
      </Avatar>
      <Avatar {...args} role="img" aria-label="Emi Sato">
        <AvatarFallback aria-hidden>ES</AvatarFallback>
      </Avatar>
      <AvatarGroup role="group" aria-label="People on this account">
        {people.slice(3, 6).map((person) => (
          <Avatar key={person.name} {...args} role="img" aria-label={person.name}>
            <AvatarImage src={person.src} alt="" />
            <AvatarFallback aria-hidden>{person.initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount aria-label="and 2 more">+2</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
}

/** A Tailwind utility in `className` beats the module style, for example a rounded square for a company. */
export const ClassNameOverride: Story = {
  args: { className: "rounded-lg after:rounded-lg" },
  render: (args) => (
    <Avatar {...args} role="img" aria-label="Acme Ltd">
      <AvatarFallback aria-hidden className="rounded-lg">AC</AvatarFallback>
    </Avatar>
  ),
}
