# Pure IPC Backend Architecture (No Localhost Ports)

## Overview

This document proposes migrating Idatzi from a localhost HTTP child-process backend to a **pure Electron IPC** architecture.

Goal: remove listening ports (e.g., `localhost:3099`), simplify runtime behavior, and reduce security and packaging complexity.

---

## Current State

Today the app:

- spawns `scripts/test-backend.cjs` as a child process from Electron main
- uses HTTP calls from main to `http://localhost:3099` for health/content
- allows renderer `connect-src` to localhost in CSP
- has extra lifecycle complexity (startup polling, health checks, timeout handling)

Issues observed:

- startup races and timeout loops
- packaging/runtime divergence between dev and production
- unnecessary local network surface area

---

## Target State

Use only Electron-native communication:

- **Renderer** calls `window.idatzi.*` API exposed by preload
- **Preload** forwards to `ipcRenderer.invoke(...)`
- **Main** implements all state/persistence logic directly via `ipcMain.handle(...)`
- no HTTP backend process
- no listening sockets/ports

### High-level diagram

```text
Renderer (UI)
   ↓ window.idatzi.*
Preload (contextBridge)
   ↓ ipcRenderer.invoke
Main process (ipcMain handlers + persistence)
   ↕ filesystem / app storage
```

---

## Proposed IPC Contract

Keep API semantics close to current code to minimize renderer changes.

### Existing methods to preserve

- `backend:status` -> `'connected' | 'disconnected' | 'starting'`
- `backend:save-content` -> `boolean`
- `backend:load-content` -> `string | null`

### New internal behavior

- `backend:status` always returns `'connected'` once main is ready
- `backend:start` / `backend:stop` become no-op compatibility handlers (or can be removed later)
- `backend:save-content` and `backend:load-content` read/write directly in main process

---

## Data Persistence Strategy

Replace in-memory HTTP backend store with main-process storage.

Recommended location:

- `app.getPath('userData')/content.json`

Behavior:

- save: write JSON atomically (temp file + rename)
- load: return empty/null if file missing
- include versioned envelope for future migrations

Example structure:

```json
{
  "version": 1,
  "updatedAt": "2026-05-30T00:00:00.000Z",
  "content": "# Markdown..."
}
```

---

## Security Improvements

After migration:

- no localhost HTTP server
- no local port exposed even to same-machine processes
- CSP can drop backend localhost requirement if renderer no longer fetches URLs directly
- reduced attack surface and fewer network-related failure modes

---

## Migration Plan (Phased)

### Phase 1 — Main-process storage layer

1. Add content repository module in `src/main/` (e.g., `content-store.ts`)
2. Implement read/write with robust error handling
3. Add unit tests for store behavior (missing file, corrupt JSON, writes)

### Phase 2 — IPC switch

1. Modify `backend:save-content` and `backend:load-content` handlers to call store directly
2. Keep return types unchanged
3. Keep status/start/stop handlers for compatibility

### Phase 3 — Remove HTTP backend lifecycle

1. Remove `startBackend()`/`stopBackend()` startup calls
2. Delete health-check polling logic
3. Remove `scripts/test-backend.cjs` and `src/main/backend.ts` (or keep a tiny compatibility stub until fully unused)

### Phase 4 — CSP cleanup

1. Remove `http://localhost:3099` from `connect-src` if no network calls remain
2. Keep dev-only websocket allowance as needed for Vite in development

### Phase 5 — Final cleanup

1. Remove deprecated IPC channels if no renderer call sites remain
2. Update docs and architecture notes
3. Validate Linux/macOS/Windows packaged behavior

---

## Compatibility Notes

To avoid large refactors, preserve preload API names initially:

- `saveToBackend()` and `loadFromBackend()` can remain named the same
- implementation becomes pure IPC-backed persistence in main

This allows a safe migration with minimal UI changes.

---

## Testing Checklist

- cold start loads last content
- content persists after app restart
- no process listening on `3099`
- no `ERR_CONNECTION_REFUSED` to localhost URLs
- no backend startup timeout logs
- packaged app works identically to dev behavior (minus HMR)

Suggested verification commands (Linux):

```bash
ss -ltnp | grep 3099 || echo "No listener on 3099"
```

---

## Risks and Mitigations

### Risk: data corruption on crash during write

Mitigation: atomic write pattern (write temp file, fsync, rename).

### Risk: legacy code still expecting backend status transitions

Mitigation: provide stable compatibility status via IPC and gradually remove status-dependent UI assumptions.

### Risk: migration regression in packaged app

Mitigation: add integration smoke test that opens app, saves content, restarts, verifies load.

---

## Acceptance Criteria

- [ ] No HTTP backend child process spawned
- [ ] No localhost backend port used in runtime
- [ ] Renderer persistence works via IPC only
- [ ] Packaged apps (deb/dmg/exe) run without localhost connection errors
- [ ] Documentation updated to reflect new architecture

---

## Recommendation

Proceed with phased migration while preserving existing preload API names for short-term compatibility. This yields immediate stability and security improvements with minimal renderer churn.