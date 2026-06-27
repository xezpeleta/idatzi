# Changelog

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
