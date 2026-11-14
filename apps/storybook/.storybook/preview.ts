import type { Preview } from "@storybook/react-vite"

import "./preview.css" 
//test

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
