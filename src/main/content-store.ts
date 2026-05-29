/**
 * Content persistence store.
 * Saves and loads editor content in the app's user data directory.
 * Uses atomic writes to prevent corruption on crash.
 */
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const STORE_FILENAME = 'content.json';

interface StoreEnvelope {
  version: 1;
  updatedAt: string;
  content: string;
}

let contentCache: string | null = null;

function getStorePath(): string {
  return path.join(app.getPath('userData'), STORE_FILENAME);
}

export function saveContent(content: string): boolean {
  try {
    const storePath = getStorePath();
    const dir = path.dirname(storePath);
    fs.mkdirSync(dir, { recursive: true });

    const envelope: StoreEnvelope = {
      version: 1,
      updatedAt: new Date().toISOString(),
      content,
    };

    const tmp = storePath + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(envelope, null, 2), 'utf-8');
    fs.renameSync(tmp, storePath);

    contentCache = content;
    return true;
  } catch (err) {
    console.error('[content-store] Failed to save:', err);
    return false;
  }
}

export function loadContent(): string | null {
  if (contentCache !== null) return contentCache;

  try {
    const storePath = getStorePath();
    if (!fs.existsSync(storePath)) return null;

    const raw = fs.readFileSync(storePath, 'utf-8');
    const envelope = JSON.parse(raw) as StoreEnvelope;

    if (!envelope || typeof envelope.content !== 'string') return null;

    contentCache = envelope.content;
    return contentCache;
  } catch (err) {
    console.error('[content-store] Failed to load:', err);
    return null;
  }
}

/** Clear the in-memory cache (forces re-read from disk next time). */
export function clearCache(): void {
  contentCache = null;
}
