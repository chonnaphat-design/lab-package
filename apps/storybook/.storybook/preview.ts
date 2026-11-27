import type { Preview } from "@storybook/react-vite"

import "./preview.css" 
//test two three

const preview: Preview = {
  parameters: {
    options: {
      // Thai introduction first, then components.
      storySort: { order: ["แนะนำ", "Components", ["*", ["คู่มือการใช้งาน", "Docs", "*"]]] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
