import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"

/**
 * Resolves the absolute path of a package.
 * Needed in projects set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  // Stories live next to their components in the library.
  stories: ["../../../packages/ui/src/**/*.stories.tsx"],
  addons: [],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(viteConfig) {
    // preview.css and the components' CSS Modules are Tailwind v4 source.
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
