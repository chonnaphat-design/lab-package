# Avatar

**Purpose:** A small circle showing a person's photo, or their initials when there's no photo, so people can recognise who's who at a glance.

## When to use

- Next to a person's name, in lists, comments, messages and account headers.
- On its own where space is tight and the person is clear from context, such as the signed-in user in a header.
- A stack of the people on an account or project, with a "+N" for the rest.

## When not to use

| Instead of an avatar for…                                  | Use                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| A company, team or app                                     | A square avatar. TODO: no square shape yet; a `className` override works, as the `ClassNameOverride` story shows. |
| A status or count on its own                               | **Badge**                                                   |
| A large profile photo                                      | An image. Avatar stops at 40px.                             |
| The only way to tell people apart, with no name anywhere   | Show the name too. Faces and initials alone are hard to tell apart. |

## Writing the name and initials

- **Name the avatar, not the photo.** Use the person's name, such as "Ana Lima". Don't write "Avatar of" or "Photo of".
- **Initials:** one or two letters, the first letters of the first and last name, such as "AL". Sources disagree on single names: Fluent uses one letter, IBM Carbon the first two. TODO: pick one rule.
- **Names that don't suit initials,** such as Chinese, Japanese, Korean or Arabic names, or a phone number: show a person icon instead. Fluent does this.

## Anatomy

| Part                 | Role                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| **Avatar**           | The circle. Loads the image and switches to the fallback if it fails.      |
| **AvatarImage**      | The photo.                                                                 |
| **AvatarFallback**   | Shown while the photo loads, if it fails, or if there is none: initials or an icon. |
| **AvatarBadge**      | Optional. A small dot in the bottom-right corner, such as a status.        |
| **AvatarGroup**      | Optional. A row of overlapping avatars.                                    |
| **AvatarGroupCount** | Optional. The "+3" circle at the end of a group.                           |

## Import and use

Install the package, then import its stylesheet **once** at the root of your app, such as in `app/layout.tsx`:

```bash
npm install @chonny_iamsrithong/lab-package
```

```tsx
import "@chonny_iamsrithong/lab-package/styles.css"
```

Then import the component where you use it:

```tsx
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@chonny_iamsrithong/lab-package"

<Avatar role="img" aria-label="Ana Lima">
  <AvatarImage src="/people/ana.jpg" alt="" />
  <AvatarFallback aria-hidden>AL</AvatarFallback>
</Avatar>
```

- Import only the parts you use.
- Avatar ships with `"use client"`, so you can render it from a Server Component.

## Making it make sense to screen readers

Choose one of two cases:

- **The name is shown beside it:** the avatar is decoration. Use `alt=""` on the image and `aria-hidden` on the fallback, as the `WithName` story does.
- **The avatar stands alone:** name the whole avatar with `role="img"` and `aria-label`, and hide what's inside: `alt=""` on the image and `aria-hidden` on the fallback. Fluent and Shopify Polaris do this. Screen readers then hear "Ana Lima" whether the photo or the initials show. If you put the name only in the image's `alt`, a failed photo is read as "A L".

## Props and variants

Avatar has **no `variant` prop**. It is always a circle with a faint inner edge, so a light photo doesn't melt into a light page.

### Avatar

| Prop        | Default | What it does                                              |
| ----------- | ------- | --------------------------------------------------------- |
| `size`      | `md`    | `sm` 24px, `md` 32px or `lg` 40px.                        |
| `className` | none    | For one-off tweaks, such as a square shape for a company. |

Use `sm` in dense lists, `md` in most places, and `lg` where the person is the focus, such as an account header. Initials are 12px at `sm` and 14px otherwise.

### AvatarImage

Takes `src` and the other `img` props. `alt=""` in both cases above. Base UI loads the image first and only shows it once it has loaded.

### AvatarFallback

| Prop    | Default | What it does                                                                         |
| ------- | ------- | ------------------------------------------------------------------------------------ |
| `delay` | `0`     | Milliseconds to wait before showing the fallback. A short delay, such as 600, stops initials flashing before a fast photo loads. Fluent shows initials during loading on purpose, so sources disagree. |

The fallback is grey with grey initials. TODO: there's no per-person colour. Fluent can pick one from the name; if added, initials still need 4.5:1 contrast on every colour.

### AvatarBadge

A dot in the bottom-right corner: 8px at `sm`, 10px at `md`, 12px at `lg`. It can hold a small icon at `md` and `lg`; at `sm` the icon is hidden.

- **Put the status into the avatar's name,** such as `aria-label="Dev Patel, verified"`, and hide the badge with `aria-hidden`, as the `WithBadge` story does.
- **Known issue:** in light mode the lime dot is 1.53:1 against the white ring around it and 1.39:1 against a grey initials circle, below the 3:1 a meaningful dot needs. In dark mode it's 10.06:1. TODO: decide the badge colour.
- **Not a presence indicator yet.** There's one colour and no shapes, so it can't show online, away or busy apart. Fluent uses a different icon per status so colour isn't the only cue. TODO: decide whether to add presence states. At 32px and below, Fluent warns the badge is hard to see, so also show the status in text nearby.

### AvatarGroup and AvatarGroupCount

Avatars overlap by 8px, each with a 2px ring in the page colour. The count circle matches the size of the avatars in its group.

- **Show up to five,** then "+N". Atlassian and Fluent stop at five; GitHub Primer at four.
- **Label the group,** such as `role="group" aria-label="People on this account"`. Give each group on a page its own label.
- **Name the hidden people in the count,** such as `aria-label="and 3 more: Dev Patel, Emi Sato, Finn Murphy"`, as the `Group` story does.
- TODO: the count isn't a button. Fluent makes "+N" open a list of everyone; Atlassian shows the names on hover. Decide whether to add one.

### Interactive avatars

Avatars aren't focusable or clickable on their own. To link to a profile, wrap the avatar in a link or Button with an accessible name. It then needs a visible focus ring and at least a 24 × 24px target. Overlapping avatars in a group are too close together to be separate targets. Don't add a hover-only tooltip to a plain avatar: keyboard and screen-reader users can't reach it.

Dark mode is applied automatically when a `.dark` class is set on a parent element. The faint inner edge switches blend mode to stay visible.

## Contrast

| What                         | Light | Dark  | Needs |
| ---------------------------- | ----- | ----- | ----- |
| Initials on the grey circle  | 4.78  | 6.14  | 4.5   |
| Badge icon on the badge      | 5.72  | 4.50  | 3     |
| Badge against its ring       | 1.53  | 10.06 | 3, see above |

axe (WCAG 2.2 AA) passes every story.

## Tokens used

| Token                  | Used for                                               |
| ---------------------- | ------------------------------------------------------ |
| `--muted`              | Fallback and count circle background                   |
| `--muted-foreground`   | Initials and the count text                            |
| `--border`             | The faint inner edge                                   |
| `--primary`            | Badge colour                                           |
| `--primary-foreground` | Badge icon                                             |
| `--background`         | The ring around the badge and around grouped avatars   |

## Example

The `Group` story, written out with the default size:

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@chonny_iamsrithong/lab-package"

<AvatarGroup role="group" aria-label="People on this account">
  <Avatar role="img" aria-label="Ana Lima">
    <AvatarImage src="/people/ana.jpg" alt="" />
    <AvatarFallback aria-hidden>AL</AvatarFallback>
  </Avatar>
  <Avatar role="img" aria-label="Ben Okafor">
    <AvatarImage src="/people/ben.jpg" alt="" />
    <AvatarFallback aria-hidden>BO</AvatarFallback>
  </Avatar>
  <Avatar role="img" aria-label="Chloé Martin">
    <AvatarImage src="/people/chloe.jpg" alt="" />
    <AvatarFallback aria-hidden>CM</AvatarFallback>
  </Avatar>
  <AvatarGroupCount aria-label="and 3 more: Dev Patel, Emi Sato, Finn Murphy">+3</AvatarGroupCount>
</AvatarGroup>
```

The story uses built-in placeholder photos; the paths here stand in for your own.
