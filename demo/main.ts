import './style.css'
import 'idaztian/style.css'
import { IdaztianEditor } from 'idaztian'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app-container">
    <header class="header">
      <h1>Idatzi ✍</h1>
      <div class="controls">
        <label>
          Theme:
          <select id="theme-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </label>
        <label>
          <input type="checkbox" id="toggle-read-only" /> Read Only
        </label>
        <button id="toggle-toolbar">Toggle Toolbar</button>
      </div>
    </header>
    
    <div id="editor-container"></div>
  </div>
`

const container = document.getElementById('editor-container')!

const editor = new IdaztianEditor({
  parent: container,
  initialContent: '# Welcome to Idatzi ✍\n\n**Idatzi** is a live-preview markdown editor powered by **[Idaztian](https://github.com/xezpeleta/Idaztian)**, the editor framework.\n\n- It features live-preview out of the box\n- Just import the style and the class, and initialize it.\n- You can optionally enable the toolbar or context menu.\n\n## Try it\n\nType some **bold** or *italic* text. Use \`inline code\`. Press `Ctrl+B` for bold.\n\n```typescript\nimport { IdaztianEditor } from \'idaztian\'\nconst editor = new IdaztianEditor({\n  parent: document.getElementById(\'editor\'),\n  initialContent: \'# Hello World\',\n})\n```\n\n> This is a blockquote.\n\n| Feature | Status |\n|---------|--------|\n| Live preview | ✅ Done |\n| Tables | ✅ Done |\n| Blockquotes | ✅ Done |\n| Code blocks | ✅ Done |\n| Task lists | ✅ Done |\n\n- [x] Install Idaztian\n- [x] Create the editor\n- [ ] Publish your content',
  toolbar: true,
  readOnly: false,
  theme: 'light'
})

document.getElementById('theme-select')!.addEventListener('change', (e) => {
  const theme = (e.target as HTMLSelectElement).value as 'light' | 'dark' | 'system'
  editor.setTheme(theme)
})

document.getElementById('toggle-read-only')!.addEventListener('change', (e) => {
  const readOnly = (e.target as HTMLInputElement).checked
  editor.setReadOnly(readOnly)
})

document.getElementById('toggle-toolbar')!.addEventListener('click', () => {
  editor.toggleToolbar()
})
