import { readFileSync } from "node:fs"

import { defineConfig } from "vite"
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

export default defineConfig({
  plugins: [dts({ include: ["src"], entryRoot: "src" })],
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
