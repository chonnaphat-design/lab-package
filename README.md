# lab-package

Monorepo for the `lab-package` React design system.

- [`packages/ui`](packages/ui): the library published to npm as `lab-package`. Usage is in its [README](packages/ui/README.md).
- [`apps/storybook`](apps/storybook): Storybook 10 for checking component props and states. Stories sit beside each component in `packages/ui/src/components`.

```bash
npm install
npm run storybook                  # http://localhost:6006
npm run build -w lab-package       # build the library
```

Contributor and agent rules: [AGENTS.md](AGENTS.md).
