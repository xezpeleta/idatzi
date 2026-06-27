import { IdaztianEditor, createTransformersJsProvider, getTransformersJsState } from 'idaztian'

/**
 * File open and download utilities.
 */
function openFile(): Promise<{ content: string; filename: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'
    input.style.display = 'none'
    document.body.appendChild(input)

    const handler = () => {
      const file = input.files?.[0]
      if (!file) { resolve(null); return }
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve({ content: (e.target?.result as string) ?? '', filename: file.name })
      }
      reader.onerror = () => resolve(null)
      reader.readAsText(file)
      document.body.removeChild(input)
    }
    input.addEventListener('change', handler, { once: true })
    input.click()
  })
}

function downloadFile(content: string, filename = 'document.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.style.display = 'none'
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const STORAGE_KEY = 'idaztian:doc'
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function saveContent(content: string): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, content) } catch { /* ignore */ }
  }, 300)
}

function loadContent(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

// ── Sample content ──────────────────────────────────────────────────────────

const SAMPLE_CONTENT = `# Welcome to Idaztian

**Idaztian** is a live-preview markdown editor framework. Move your cursor onto any formatted element to reveal its syntax — move away to see the rendered result.

## Live Preview Features

### Emphasis

This text has **bold**, *italic*, and ***bold italic*** formatting. Try clicking on each word to reveal the syntax.

You can also use ~~strikethrough~~ text.

### Links and Images

Here is a [link to the Idaztian repository](https://github.com/xezpeleta/Idaztian). Click on it to see the full syntax.

Image with alt text (move cursor away to see it rendered):

![A scenic mountain landscape](sample.jpg)

Broken images show the alt text and an error indicator:

![This image does not exist](/nonexistent.png)

### Lists

Bullet list:
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered list:
1. First step
2. Second step
3. Third step

Task list:
- [x] Create the PRD
- [x] Plan Phase 1
- [x] Implement the framework
- [ ] Write tests
- [ ] Publish to npm

### Code

Inline code: \`const editor = new IdaztianEditor(config)\`

Fenced code block:

\`\`\`typescript
import { IdaztianEditor } from 'idaztian';

const editor = new IdaztianEditor({
  parent: document.getElementById('editor'),
  initialContent: '# Hello World',
  onChange: (content) => console.log(content),
});
\`\`\`

### Blockquotes

> This is a blockquote. Move your cursor here to see the \`>\` marker.
>
> It can span multiple lines.

### Alerts / Callouts

> [!NOTE]
> This is a note callout. Move your cursor here to reveal the raw syntax.

> [!TIP]
> Use **Ctrl+B** for bold, **Ctrl+I** for italic, and **Ctrl+K** for links.

> [!WARNING]
> Unsaved changes will be lost if you close the tab without downloading.

> [!IMPORTANT]
> Idaztian auto-saves your work to browser localStorage on every keystroke.

> [!CAUTION]
> Large documents with many images may affect performance.

### Footnotes

Footnotes let you add references[^1] without cluttering the text[^2].

[^1]: This is the first footnote definition.
[^2]: And this is the second one.

### Math (LaTeX)

Inline math renders inside a sentence: the famous mass-energy equivalence $E = mc^2$ by Einstein.

Another inline example: Euler's identity $e^{i\\pi} + 1 = 0$ is considered the most beautiful equation.

Block math is centred on its own line:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2}\\, dx = \\sqrt{\\pi}
$$

The quadratic formula:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

### Horizontal Rule

---

### Tables

Tables are **always rendered** as styled HTML. Click any cell to enter editing mode, then **Tab** / **Shift+Tab** to navigate between cells. Hover the edges to reveal **+** buttons for adding rows and columns.

| Feature | Phase | Status |
|---|---|---|
| Headings, bold, italic | Phase 1 | Done |
| Links, images, code | Phase 1 | Done |
| Alerts, footnotes, math | Phase 2A | Done |
| Smart pairs, paste, drag & drop | Phase 2A | Done |
| Tables | Phase 2B | Done |
| Context menu | Phase 2B | Done |
| Toolbar | Phase 2B | Done |

Right-click anywhere in the editor to open the **context menu** with Format, Paragraph, and Insert submenus.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+K | Insert link |
| Ctrl+E | Inline code |
| Ctrl+S | Save/Download |
| Ctrl+F | Find |
| Ctrl+H | Find & Replace |
| Tab (in table) | Move to next cell |
| Shift+Tab (in table) | Move to previous cell |

Click the **⌨** button in the header to see all shortcuts.

---

*Start writing your own content — or click **Open** to load a markdown file.*
*You can also **drag & drop** a \`.md\` file onto the editor, or **paste HTML** from any webpage to auto-convert it to markdown.*
`

// ── Editor setup ─────────────────────────────────────────────────────────────

let currentFilename = 'document.md'
const storedContent = loadContent()
let aiEnabled = false

// ── AI Completion (Transformers.js — browser-side) ──────────────────────────

function updateAIStatus(state: 'off' | 'on' | 'loading' | 'error', detail?: string) {
  const btn = document.getElementById('btn-ai')!
  const stat = document.getElementById('stat-ai')!

  // Remove all state classes
  btn.classList.remove('ai-active', 'ai-loading', 'ai-error')
  stat.classList.remove('stat-ai--off', 'stat-ai--on', 'stat-ai--loading', 'stat-ai--error')

  switch (state) {
    case 'off':
      stat.className = 'stat-ai stat-ai--off'
      stat.textContent = 'AI off'
      stat.title = 'AI completion available (Ctrl+Shift+I to enable)'
      break
    case 'on':
      btn.classList.add('ai-active')
      stat.className = 'stat-ai stat-ai--on'
      stat.textContent = 'AI on'
      stat.title = 'AI completion enabled (Ctrl+Shift+I to disable)'
      break
    case 'loading':
      btn.classList.add('ai-loading')
      stat.className = 'stat-ai stat-ai--loading'
      stat.textContent = 'AI …'
      stat.title = detail || 'Loading model...'
      break
    case 'error':
      btn.classList.add('ai-error')
      stat.className = 'stat-ai stat-ai--error'
      stat.textContent = 'AI ⚠'
      stat.title = detail || 'AI error'
      break
  }
}

function showAIProgress(pct: number, status: string) {
  updateAIStatus('loading', `${pct}% — ${status}`)
  // Update the progress bar
  const bar = document.getElementById('ai-load-progress')
  const fill = document.getElementById('ai-load-progress-fill')
  const text = document.getElementById('ai-load-progress-text')
  if (bar) bar.hidden = false
  if (fill) fill.style.width = `${pct}%`
  if (text) text.textContent = `Downloading Qwen2.5-0.5B (${pct}%)`
}

async function toggleAI() {
  if (!aiEnabled) {
    aiEnabled = true
    updateAIStatus('loading', 'Downloading model (~500MB)...')
    // Show progress bar immediately
    const bar = document.getElementById('ai-load-progress')
    if (bar) bar.hidden = false

    try {
      // Preload the model eagerly
      await tfProvider.preload()
      updateAIStatus('on')
      // Hide progress bar on success
      const bar = document.getElementById('ai-load-progress')
      if (bar) bar.hidden = true
    } catch (err) {
      console.warn('[Idaztian Demo] Failed to preload model:', err)
      updateAIStatus('error', `Model load failed: ${(err as Error).message}`)
      // Hide progress bar on error
      const bar = document.getElementById('ai-load-progress')
      if (bar) bar.hidden = true
      // Keep AI enabled — the provider will retry on first keystroke
    }
  } else {
    aiEnabled = false
    updateAIStatus('off')
    const bar = document.getElementById('ai-load-progress')
    if (bar) bar.hidden = true
    const fill = document.getElementById('ai-load-progress-fill')
    if (fill) fill.style.width = '0%'
  }
}

// Create the Transformers.js provider (fully-local, browser-side)
const tfProvider = createTransformersJsProvider({
  modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
  dtype: 'q4f16',
  maxNewTokens: 40,
  temperature: 0.3,
  systemPrompt: 'You are a concise writing assistant. Your task is to continue the provided text naturally. Output ONLY the continuation — never add explanations, greetings, or commentary. Match the tone, style, and language of the preceding text exactly.',
  onProgress: showAIProgress,
  onReady() {
    if (aiEnabled) {
      updateAIStatus('on')
    }
  },
  onError(err) {
    if (aiEnabled) {
      updateAIStatus('error', err)
      console.warn('[Idaztian Demo] AI error:', err)
    }
  },
})

// Wrap the provider to respect the aiEnabled toggle
const gatedProvider = {
  async fetchCompletion(context: string, signal: AbortSignal) {
    if (!aiEnabled) return null
    try {
      return await tfProvider.fetchCompletion(context, signal)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return null
      console.warn('[Idaztian Demo] AI completion error:', err)
      return null
    }
  },
}

const editor = new IdaztianEditor({
  parent: document.getElementById('editor')!,
  initialContent: storedContent ?? SAMPLE_CONTENT,
  toolbar: true,
  contextMenu: true,
  extensions: {
    math: true,
    aiCompletion: {
      provider: gatedProvider,
      debounceMs: 500,
    },
  },
  onChange(content) {
    updateStats(content)
    saveContent(content)
  },
  onSave(content) {
    downloadFile(content, currentFilename)
  },
})

// ── Stats bar ────────────────────────────────────────────────────────────────

function updateStats(content: string) {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  const chars = content.replace(/\n/g, '').length
  const lines = content.split('\n').length

  document.getElementById('stat-words')!.textContent = `Words: ${words.toLocaleString()}`
  document.getElementById('stat-chars')!.textContent = `Characters: ${chars.toLocaleString()}`
  document.getElementById('stat-lines')!.textContent = `Lines: ${lines.toLocaleString()}`
}

updateStats(storedContent ?? SAMPLE_CONTENT)

// ── Header buttons ───────────────────────────────────────────────────────────

document.getElementById('btn-open')!.addEventListener('click', async () => {
  const result = await openFile()
  if (result) {
    editor.setContent(result.content)
    currentFilename = result.filename
    document.title = `${result.filename} — Idaztian`
    updateStats(result.content)
  }
})

document.getElementById('btn-download')!.addEventListener('click', () => {
  downloadFile(editor.getContent(), currentFilename)
})

document.getElementById('btn-toolbar')!.addEventListener('click', () => {
  editor.toggleToolbar()
})

// ── Shortcuts modal ──────────────────────────────────────────────────────────

const modal = document.getElementById('shortcuts-modal')!
const backdrop = document.getElementById('modal-backdrop')!

function openModal() {
  modal.hidden = false
  document.getElementById('btn-close-modal')!.focus()
}

function closeModal() {
  modal.hidden = true
  editor.focus()
}

document.getElementById('btn-shortcuts')!.addEventListener('click', openModal)
document.getElementById('btn-close-modal')!.addEventListener('click', closeModal)
backdrop.addEventListener('click', closeModal)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal()
})

// ── AI Toggle ───────────────────────────────────────────────────────────────

document.getElementById('btn-ai')!.addEventListener('click', toggleAI)
document.getElementById('stat-ai')!.addEventListener('click', toggleAI)

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
    e.preventDefault()
    toggleAI()
  }
})

// Initialize AI status
updateAIStatus('off')

// Periodically check Transformers.js state
setInterval(() => {
  if (aiEnabled) {
    const s = getTransformersJsState()
    if (s.loading) {
      updateAIStatus('loading', 'Loading model...')
    }
  }
}, 1000)
