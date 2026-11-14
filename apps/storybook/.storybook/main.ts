import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type { StorybookConfig } from "@storybook/react-vite"

const here = dirname(fileURLToPath(import.meta.url))

/** Resolves an addon/framework from this workspace (needed in a monorepo). */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("storybook-addon-pseudo-states"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(viteConfig) {
    // Stories import "lab-package" from source, so component edits hot-reload
    // without rebuilding dist/.
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = [
      ...(Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : Object.entries(viteConfig.resolve.alias ?? {}).map(
            ([find, replacement]) => ({ find, replacement })
          )),
      { find: /^lab-package$/, replacement: resolve(here, "../../../src/index.ts") },
    ]
    return viteConfig
  },
}

export default config
