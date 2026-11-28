import { existsSync, readFileSync } from "node:fs"

import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
)

// Runtime deps and peers stay as imports; consumers install them.
const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
].map((name) => new RegExp(`^${name}(/.*)?$`))
external.push(/^react\/jsx-runtime$/)

// Ships the English usage doc of every component exported from src/index.ts as
// dist/docs/<Name>.md, so consumers and their agents can read it in node_modules.
// The docs sit flat in dist/docs, so links between them (`../Button/Button.md`)
// become `./Button.md`. Thai .mdx pages and maintainer READMEs stay out.
function componentDocs(): Plugin {
  return {
    name: "component-docs",
    generateBundle() {
      const barrel = readFileSync(new URL("./src/index.ts", import.meta.url), "utf8")
      const names = [...barrel.matchAll(/from "\.\/components\/([^"/]+)"/g)].map((m) => m[1])
      for (const name of names) {
        const doc = new URL(`./src/components/${name}/${name}.md`, import.meta.url)
        if (!existsSync(doc)) this.error(`${name} is exported but has no ${name}.md`)
        this.emitFile({
          type: "asset",
          fileName: `docs/${name}.md`,
          source: readFileSync(doc, "utf8").replace(/\]\(\.\.\/([^/)]+)\/\1\.md/g, "](./$1.md"),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [
    componentDocs(),
    dts({
      include: ["src"],
      // Stories sit beside components but are not part of the package.
      exclude: ["src/**/*.stories.tsx"],
      entryRoot: "src",
    }),
  ],
  css: {
    modules: {
      // Stable, readable prefix so library classes are recognisable in a consumer's DOM.
      generateScopedName: "ui-[name]__[local]_[hash:base64:5]",
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      cssFileName: "styles",
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external,
      output: {
        // One file per source module keeps "use client" on the components that declare it.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
})
