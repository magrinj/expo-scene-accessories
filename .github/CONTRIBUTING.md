# Contributing to expo-scene-accessories

Thanks for your interest in contributing!

## Prerequisites

- [Bun](https://bun.sh/) (package manager)
- Xcode 27.1+ with the iOS 27.1 simulator runtime (the `iPhone Duo` simulator is the primary target)

## Setup

```bash
bun install
cd example && bun install && npx expo prebuild -p ios
```

## Development Workflow

1. Make your changes in `src/` or `ios/`
2. Run the example app: `cd example && bun run ios` (pass `--device` to pick the iPhone Duo simulator)
3. Run checks: `bun run lint && bun run typecheck && bun run test`

### Testing accessories on the simulator

- **External display:** `xcrun simctl io <udid> screenConfig --display=external-0 power off`, then `power on`, connects the external screen and presents `ExternalNonInteractiveAccessory`. Capture it with `xcrun simctl io <udid> screenshot --display=external-0 out.png`.
- **Native logs:** `xcrun simctl spawn <udid> log stream --level debug --predicate 'composedMessage CONTAINS "expo-scene-accessories"'` shows registration, availability and scene lifecycle.
- **Camera accessory:** it needs the Duo in the *Open* pose (DeviceHub's pose buttons) and a running capture session. The simulator has no camera. As of RocketSim 16.5.0 its camera doesn't support the iPhone Duo simulator; SimCam is untested. Until then, verify `CameraCaptureAccessory` presentation and touch input on an iPhone Duo device.
- If Metro stops picking up file changes, restart it with `bunx expo start --clear` (a broken watchman install is the usual cause).

## Releasing

Releases run from the **Release** workflow (Actions > Release > Run workflow). `alpha` publishes the next `0.x.y-alpha.N` under the `alpha` dist-tag; `patch`, `minor` and `major` publish under `latest`. release-it bumps both packages, writes the changelog from the conventional commits, tags `v<version>`, creates the GitHub release, publishes `expo-scene-accessories`, then publishes the `@magrinj/expo-scene-accessories` alias with the same version and dist-tag.

npm trusted publishing can only be configured once a package exists, so the first release needs a token:

1. Create a granular npm token with publish rights and add it as the `NPM_TOKEN` repository secret.
2. Run the workflow with `alpha`.
3. On npmjs.com, add a trusted publisher (GitHub Actions, repository `magrinj/expo-scene-accessories`, workflow `release.yml`) to **both** packages, then delete the `NPM_TOKEN` secret.

`release-it --dry-run` still runs `npm version`: revert `package.json` before committing after a dry run.

## Pull Request Guidelines

- Keep PRs focused on a single change
- Include a clear description of what and why
- Ensure lint, typecheck and tests pass before submitting
- Add tests if applicable

## Code Style

This project uses ESLint (`eslint-config-universe`) and Prettier. Run `bun run lint` to check for issues.
