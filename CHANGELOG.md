# Changelog

## [0.2.3] — 2025-06-27

### Changed
- **Ghost text now rendered dimmed (opacity 0.38) and italic** — styles injected by Idaztian v1.2.2, no consumer changes needed
- Upgraded to Idaztian v1.2.2

---

## [0.2.2] — 2025-06-27

### Changed
- **Demo (GitHub Pages):** Reverted to Transformers.js provider for browser-side AI completions. No server, no API keys — model downloaded once (~30MB) and cached. WebGPU with WASM fallback.
- **Demo:** Updated model from `SmolLM-135M-Instruct` to `SmolLM2-135M-Instruct` (~2× better quality, same size)
- Upgraded to Idaztian v1.2.1

---

## [0.2.1] — 2025-06-27

### Changed
- **Demo (GitHub Pages):** Switched AI provider from Transformers.js (broken since HF now requires auth for model downloads) to **HuggingFace Inference API** — zero download, instant startup, and free. Users authenticate with a free HF token via an interactive dialog.
- **Demo:** Updated model from `SmolLM-135M-Instruct` to `SmolLM2-135M-Instruct` (~2× better quality, same size)
- Upgraded to Idaztian v1.3.0

---

## [0.2.0] — 2025-06-27

### Added
- **AI inline ghost text completion** powered by Ollama (local) or any OpenAI-compatible API
  - Ghost text appears dimmed after the cursor on typing pause (500ms debounce)
  - **Tab** to accept suggestion, **Escape** to dismiss
  - **`Ctrl+Shift+I`** keyboard shortcut to toggle AI on/off
  - **AI button** in the header toolbar with active/error states
  - **Status bar indicator** showing "AI on", "AI off", or "AI ⚠" on error
  - Provider error diagnostics:
    - Connection refused → "AI unreachable — is Ollama running?"
    - Auth failure (401/403) → "check your API key"
    - Model not found (404) → "model may not be pulled"
    - Server errors (500+) → shown with HTTP status
    - Errors auto-clear after 8 seconds or on next successful completion
  - Upgraded to Idaztian v1.1.0

### Changed
- CSP relaxed to allow connections to `localhost:*` and `https://api.openai.com`

---

## [0.1.0] — 2025-04-13

### Added
- Initial release
- Live-preview markdown editing (Idaztian v1.0.4)
- Sidebar file browser with directory navigation
- CLI & macOS Finder file opening
- Native file dialogs (open/save)
- Auto-save + localStorage fallback
- Frameless dark-themed window with custom title bar
- Keyboard shortcuts modal
- Word/character/line count in status bar
- Math rendering (KaTeX)
- Tables with interactive editing
