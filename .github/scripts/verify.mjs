// Post-build checks from AGENTS.md ("Checks after a change").
// Run from the repo root after `npm run build` and `npm run build-storybook`:
//   node .github/scripts/verify.mjs [--base <git ref>]
// --base enables the .md ↔ .mdx check against that ref (CI passes the PR base).
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const UI = "packages/ui"
const DIST = join(UI, "dist")
const COMPONENTS = join(UI, "src/components")
const STORYBOOK_INDEX = "apps/storybook/storybook-static/index.json"
const GUIDE_PAGE = "คู่มือการใช้งาน"

const failures = []
const fail = (check, detail) => failures.push(`${check}: ${detail}`)
const pass = (check) => console.log(`✓ ${check}`)

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST} not found. Run \`npm run build\` first.`)
  process.exit(1)
}

const components = readdirSync(COMPONENTS).filter((name) =>
  statSync(join(COMPONENTS, name)).isDirectory(),
)

// 1. Every component whose source starts with "use client" still does in dist.
{
  const check = '"use client" kept in dist'
  const before = failures.length
  for (const name of components) {
    const src = join(COMPONENTS, name, `${name}.tsx`)
    if (!existsSync(src) || !/^\s*["']use client["']/.test(readFileSync(src, "utf8"))) continue
    const out = join(DIST, "components", name, `${name}.js`)
    if (!existsSync(out)) fail(check, `${out} is missing`)
    else if (!/^\s*["']use client["']/.test(readFileSync(out, "utf8")))
      fail(check, `${out} no longer starts with "use client"`)
  }
  if (failures.length === before) pass(check)
}

// 2. No unresolved "@/" path aliases in dist.
{
  const check = 'no "@/" imports in dist'
  const hits = walk(DIST).filter((file) => readFileSync(file, "utf8").includes("@/"))
  hits.length ? fail(check, hits.join(", ")) : pass(check)
}

// 3. No story files in dist.
{
  const check = "no *.stories.* files in dist"
  const hits = walk(DIST).filter((file) => /\.stories\./.test(file))
  hits.length ? fail(check, hits.join(", ")) : pass(check)
}

// 4. The publish list holds only dist/**, README.md and package.json.
{
  const check = "pack file list"
  const [pack] = JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--json", "-w", "@chonny_iamsrithong/lab-package"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }),
  )
  const extra = pack.files
    .map((file) => file.path)
    .filter((path) => !path.startsWith("dist/") && path !== "README.md" && path !== "package.json")
  extra.length ? fail(check, `unexpected files: ${extra.join(", ")}`) : pass(check)
}

// 5. Storybook lists a guideline page (คู่มือการใช้งาน) for every component.
if (existsSync(STORYBOOK_INDEX)) {
  const check = `Storybook has a "${GUIDE_PAGE}" page per component`
  const entries = Object.values(JSON.parse(readFileSync(STORYBOOK_INDEX, "utf8")).entries)
  const titles = new Set(
    entries.filter((entry) => entry.type === "docs" && entry.name === GUIDE_PAGE).map((entry) => entry.title),
  )
  const missing = components.filter((name) => !titles.has(`Components/${name}`))
  missing.length ? fail(check, `missing for ${missing.join(", ")}`) : pass(check)
} else {
  console.log(`- skipped guideline-page check (${STORYBOOK_INDEX} not built)`)
}

// 6. Every changed <Name>.md has its Thai <Name>.mdx changed too.
const baseIndex = process.argv.indexOf("--base")
if (baseIndex !== -1) {
  const check = "every changed .md has its .mdx changed"
  const base = process.argv[baseIndex + 1]
  const changed = new Set(
    execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean),
  )
  const unpaired = [...changed].filter((file) => {
    const match = file.match(/^packages\/ui\/src\/components\/([^/]+)\/\1\.md$/)
    return match && !changed.has(file.replace(/\.md$/, ".mdx"))
  })
  unpaired.length
    ? fail(check, `update the Thai page too: ${unpaired.map((f) => relative(".", f).replace(/\.md$/, ".mdx")).join(", ")}`)
    : pass(check)
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log("\nAll dist and docs checks passed.")
