# Idatzi

Electron-based desktop markdown editor powered by the [Idaztian](https://github.com/xezpeleta/Idaztian) live-preview framework.

## Quick Start

```bash
npm install
npm run dev
```

## Features

- **Live-preview** markdown editing (Idaztian framework)
- **Sidebar file browser** — browse directories, open files, create/delete files and folders
- **CLI & Finder integration** — `idatzi myfile.md` or "Open with…" from macOS Finder
- **Native file dialogs** — open/save via Electron
- **Auto-save** to local backend + localStorage fallback
- **Dark-themed** frameless window with custom title bar
- **Keyboard shortcuts** (Ctrl+B, Ctrl+I, Ctrl+K, etc.)
- **Word/character/line** count in status bar
- **Math rendering** (KaTeX)
- **Tables** with interactive editing

## Requirements

- Node.js ≥ 22
- npm ≥ 10

## Architecture

See [PROJECT.md](PROJECT.md) for architecture details, IPC contract, and project structure.

## License

GPL-3.0
