# Releasing

Versions are managed with [Changesets](https://changesets.dev). CI builds **beta** snapshots from `develop`; publishing to npm is always done by hand by the maintainer.

The starting point is the stable release already on npm: `@chonny_iamsrithong/lab-package@1.0.0`, tagged `latest`, which is also the version in `packages/ui/package.json`. Every beta builds on the stable version in `package.json`, and CI refuses to cut one if that version is not on npm.

## 1. Add a changeset with your change

Any pull request that changes what consumers get from `packages/ui` adds a changeset:

```bash
npx changeset
```

Pick `@chonny_iamsrithong/lab-package`, choose `patch`, `minor` or `major`, and write a one-line summary for the changelog. Commit the generated `.changeset/<name>.md` with the change. A breaking change (a renamed or removed export, prop, variant, `data-slot` or token) is `major`.

`npx changeset status` shows what is pending. The Storybook workspace is private and is never versioned.

## 2. CI packs a beta on `develop`

On every push to `develop`, the **Beta snapshot** job in `.github/workflows/ci.yml` runs after **Check components** passes. It:

1. Skips the run if no changeset in `.changeset/` bumps the library.
2. Checks that the version in `packages/ui/package.json` is a stable `x.y.z` that is on npm.
3. Sets `snapshot.useCalculatedVersion: true` and `snapshot.prereleaseTemplate: "{tag}.<run number>"` in `.changeset/config.json`, in the CI checkout only.
4. Runs `npx changeset version --snapshot beta`, so a pending `patch` on `1.0.0` becomes `1.0.1-beta.<run number>`.
5. Checks the result is `x.y.z-beta.<run number>`, that `x.y.z` comes after npm's `latest`, and that the version is not on npm yet.
6. Builds the library, runs `npm pack`, and uploads the `.tgz` as the artifact `lab-package-<version>`.

The job checks out without push credentials and never commits, so the snapshot config, version bump and consumed changesets never reach Git. The changesets stay pending on `develop`, and each later push packs a new beta with a higher run number. The run's summary page shows the version.

A newer push to `develop` cancels a run still in progress (the workflow's `concurrency` setting), so only the latest push gets a beta.

## 3. Publish a beta by hand

Find the run on the Actions tab, or:

```bash
gh run list --workflow CI --branch develop --event push --limit 5
```

Download its artifact (replace the run id and version):

```bash
gh run download <run-id> --name lab-package-1.0.1-beta.42 --dir beta
```

Check what will be published:

```bash
tar -tzf beta/chonny_iamsrithong-lab-package-1.0.1-beta.42.tgz
```

The list should hold only `package/dist/**`, `package/README.md` and `package/package.json`.

Publish it under the `beta` tag:

```bash
npm publish beta/chonny_iamsrithong-lab-package-1.0.1-beta.42.tgz --tag beta
```

`--tag beta` is what keeps the prerelease off `latest`. Always pass it: npm 11 refuses a prerelease without `--tag`, but older npm versions publish it as `latest`. npm asks for a one-time password if your account uses 2FA.

## 4. Install the beta

In a consumer app:

```bash
npm install @chonny_iamsrithong/lab-package@beta
```

## 5. Check `latest` still points to stable

```bash
npm view @chonny_iamsrithong/lab-package dist-tags
```

Expected: `latest` is still the stable version (`1.0.0`) and `beta` is the version you just published. If `latest` moved to the beta, point it back:

```bash
npm dist-tag add @chonny_iamsrithong/lab-package@1.0.0 latest
```

## Reproduce a beta locally

To see what CI would produce, run the same steps in a clean working tree, then undo them:

```bash
node .github/scripts/beta-snapshot.mjs pending
GITHUB_RUN_NUMBER=1 node .github/scripts/beta-snapshot.mjs configure
npx changeset version --snapshot beta
GITHUB_RUN_NUMBER=1 node .github/scripts/beta-snapshot.mjs verify
npm run build && npm pack -w @chonny_iamsrithong/lab-package
```

`changeset version` bumps `packages/ui/package.json`, deletes the consumed changesets and writes `packages/ui/CHANGELOG.md`. Undo all three, plus the config edit:

```bash
git restore .changeset packages/ui/package.json
```

```bash
git clean -f packages/ui/CHANGELOG.md
```

Run the `git clean` only while `CHANGELOG.md` is not yet tracked; once a stable release commits it, `git restore packages/ui/CHANGELOG.md` instead.

## Stable releases

TODO: not automated yet. Cutting a stable release (`npx changeset version` on `main`, then `npm publish`) is the maintainer's call.
