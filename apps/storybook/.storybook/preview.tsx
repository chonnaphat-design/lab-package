import { withThemeByClassName } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react-vite"

import "./preview.css"

const preview: Preview = {
  // Light/dark switch in the toolbar: toggles `.dark` on <html>, like next-themes.
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Fail on a11y violations in the panel (and in tests, if added later).
    a11y: { test: "error" },
  },
}

export default preview
