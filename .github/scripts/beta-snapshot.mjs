// Steps of the "Beta snapshot" CI job (.github/workflows/ci.yml). Run from the repo root:
//   node .github/scripts/beta-snapshot.mjs pending      # are any changesets pending for the library?
//   node .github/scripts/beta-snapshot.mjs configure    # snapshot settings for this run (CI checkout only)
//   node .github/scripts/beta-snapshot.mjs verify       # after `changeset version --snapshot beta`
// `configure` and `verify` read GITHUB_RUN_NUMBER. Results go to GITHUB_OUTPUT when it is set.
// `configure` edits .changeset/config.json in place: CI never commits it, and locally you must
// `git checkout .changeset/config.json` afterwards (see RELEASING.md).
import { execFileSync } from "node:child_process"
import { appendFileSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const PKG = "@chonny_iamsrithong/lab-package"
const PKG_JSON = "packages/ui/package.json"
const CHANGESET_DIR = ".changeset"
const CONFIG = join(CHANGESET_DIR, "config.json")
const TAG = "beta"

const output = (key, value) => {
  console.log(`${key}=${value}`)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`)
}
const die = (message) => {
  console.error(`✗ ${message}`)
  process.exit(1)
}
const runNumber = () => {
  const n = process.env.GITHUB_RUN_NUMBER
  if (!/^[1-9]\d*$/.test(n ?? "")) die(`GITHUB_RUN_NUMBER must be a positive integer, got "${n}"`)
  return n
}
const stable = (version) => /^(\d+)\.(\d+)\.(\d+)$/.exec(version)?.slice(1).map(Number)
const greater = (a, b) => {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return false
}
const npmView = (spec) => {
  try {
    // A version that is not on npm exits E404; that just means "not published".
    return execFileSync("npm", ["view", spec, "version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return ""
  }
}

const commands = {
  // A changeset counts only if it bumps the library: an empty changeset releases nothing.
  pending() {
    const files = readdirSync(CHANGESET_DIR).filter((f) => f.endsWith(".md") && f !== "README.md")
    const pending = files.filter((file) => {
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(join(CHANGESET_DIR, file), "utf8"))
      return frontmatter?.[1]
        .split(/\r?\n/)
        .some((line) => /^\s*["']?([^"':]+)["']?\s*:\s*(major|minor|patch)\s*$/.exec(line)?.[1] === PKG)
    })
    console.log(pending.length ? `Pending changesets for ${PKG}: ${pending.join(", ")}` : `No changesets pending for ${PKG}.`)
    output("pending", pending.length > 0)
  },

  // The beta must build on a stable version that is already on npm.
  configure() {
    const n = runNumber()
    const base = JSON.parse(readFileSync(PKG_JSON, "utf8")).version
    if (!stable(base)) die(`${PKG_JSON} version ${base} is not a stable x.y.z release`)
    if (npmView(`${PKG}@${base}`) !== base)
      die(`${PKG}@${base} is not on npm. Publish the stable release before cutting betas from it.`)

    const config = JSON.parse(readFileSync(CONFIG, "utf8"))
    config.snapshot = { ...config.snapshot, useCalculatedVersion: true, prereleaseTemplate: `{tag}.${n}` }
    writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`)
    console.log(`Base ${base}; snapshot template "{tag}.${n}" written to ${CONFIG} (not committed).`)
  },

  verify() {
    const n = runNumber()
    const version = JSON.parse(readFileSync(PKG_JSON, "utf8")).version
    const match = new RegExp(`^(\\d+\\.\\d+\\.\\d+)-${TAG}\\.${n}$`).exec(version)
    if (!match) die(`${PKG_JSON} version is ${version}, expected x.y.z-${TAG}.${n}`)

    const latest = npmView(`${PKG}@latest`)
    if (!stable(latest)) die(`could not read a stable "latest" for ${PKG} from npm (got "${latest}")`)
    if (!greater(stable(match[1]), stable(latest))) die(`${version} does not come after latest ${latest}`)
    if (npmView(`${PKG}@${version}`)) die(`${PKG}@${version} is already on npm`)

    console.log(`✓ ${version} (latest on npm: ${latest})`)
    output("version", version)
  },
}

const command = commands[process.argv[2]]
if (!command) die(`usage: node ${process.argv[1]} ${Object.keys(commands).join("|")}`)
command()
