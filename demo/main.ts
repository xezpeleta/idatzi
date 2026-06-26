import { IdaztianEditor } from 'idaztian'
import 'idaztian/style.css'

const SAMPLE = `# Welcome to Idatzi ✍

**Idatzi** is a live-preview markdown editor powered by **[Idaztian](https://github.com/xezpeleta/Idaztian)**, the editor framework.

## Features

- **Live preview** — move your cursor onto any formatted element to reveal its syntax, move away to see the rendered result.
- **Toolbar** — format text, insert links, create lists with a click.
- **Context menu** — right-click for cut/copy/paste actions.

## Try it out

### Text formatting
This text has **bold**, *italic*, and ~~strikethrough~~ formatting. You can also combine ***bold italic***.

### Lists
- Unordered list item
- Another item
  - Nested item
- Third item

### Ordered list
1. First step
2. Second step
3. Third step

### Task list
- [x] Install Idaztian
- [x] Create the editor
- [ ] Publish your content

### Code
Inline code: \`const editor = new IdaztianEditor(config)\`

\`\`\`typescript
import { IdaztianEditor } from 'idaztian'
import 'idaztian/style.css'

const editor = new IdaztianEditor({
  parent: document.getElementById('editor'),
  initialContent: '# Hello World',
  theme: 'light',
  toolbar: true,
})
\`\`\`

### Blockquotes
> This is a blockquote. Move your cursor onto this line to see the \`>\` prefix.

> [!NOTE]  
> This is a note callout. Try it yourself!

### Links and Images
Visit the [Idaztian repository](https://github.com/xezpeleta/Idaztian) for more details.

### Horizontal Rule

---

Separate sections with horizontal rules.

### Tables

| Feature | Status |
|---------|--------|
| Live preview | ✅ Done |
| Tables | ✅ Done |
| Blockquotes | ✅ Done |
| Code blocks | ✅ Done |
| Task lists | ✅ Done |

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold | \`Ctrl+B\` |
| Italic | \`Ctrl+I\` |
| Inline code | \`Ctrl+E\` |
| Strikethrough | \`Ctrl+Shift+K\` |
| Insert link | \`Ctrl+K\` |
| Heading 1–6 | \`Ctrl+1\` – \`Ctrl+6\` |
| Undo | \`Ctrl+Z\` |
| Redo | \`Ctrl+Shift+Z\` |
| Find | \`Ctrl+F\` |

Click the **⌨** button in the footer to see all shortcuts.
`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="demo-container">
    <header class="demo-header">
      <span class="demo-logo">✍</span>
      <h1>Idatzi</h1>
      <span class="demo-tagline">Live Preview Markdown Editor</span>
      <a href="https://github.com/xezpeleta/Idaztian" class="demo-gh-link" target="_blank" rel="noopener">GitHub</a>
    </header>
    <div id="editor-container"></div>
  </div>
`

const container = document.getElementById('editor-container')!

new IdaztianEditor({
  parent: container,
  initialContent: SAMPLE,
  toolbar: true,
  theme: 'light',
  lineNumbers: true,
})
