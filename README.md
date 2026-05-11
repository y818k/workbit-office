# Workbit Office

Workbit Office is a VS Code extension that visualizes AI coding agents as a cozy, pixel-art-inspired office.

## v0.1 scope

- VS Code extension command: `Workbit Office: Open Office`
- TypeScript extension host code
- React + Vite webview project structure
- Main webview UI with left navigation
- Office, Layout, Shop, and Settings screens
- 12x10 office grid based on 64px cells
- Two starter desks and two dummy agents
- Dummy agent state rotation across `idle`, `thinking`, `editing`, `testing`, `waiting`, and `error`
- In-memory English / Japanese language selector

## Development

```bash
npm install
npm run build
```

Then launch the extension with the `Run Workbit Office Extension` VS Code debug configuration and run `Workbit Office: Open Office` from the Command Palette.

## Not included in v0.1

- Codex log parsing
- Real point calculation
- Persistent storage
- Furniture purchasing
- Drag save behavior
- Walking animation
- Marketplace publishing configuration
