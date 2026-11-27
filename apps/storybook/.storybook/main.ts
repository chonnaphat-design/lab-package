import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"
import remarkGfm from "remark-gfm"

/**
 * Resolves the absolute path of a package.
 * Needed in projects set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  // Stories and Thai guideline pages (.mdx) live next to their components in the library.
  stories: [
    "../../../packages/ui/src/**/*.mdx",
    "../../../packages/ui/src/**/*.stories.tsx",
  ],
  addons: [
    {
      name: getAbsolutePath("@storybook/addon-docs"),
      // MDX has no tables without GitHub-flavoured Markdown.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(viteConfig) {
    // preview.css and the components' CSS Modules are Tailwind v4 source.
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
