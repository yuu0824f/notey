import Dexie, { type Table } from 'dexie'
import type { Note, Category, Tag, UserSettings } from '../types'

export class LuminaNotesDB extends Dexie {
  notes!: Table<Note, string>
  categories!: Table<Category, string>
  tags!: Table<Tag, string>
  settings!: Table<{ key: string; value: unknown }, string>

  constructor() {
    super('LuminaNotesDB')
    this.version(1).stores({
      notes: 'id, categoryId, *tags, isFavorite, isPinned, isArchived, isDeleted, createdAt, updatedAt',
      categories: 'id, name, createdAt',
      tags: 'id, name',
      settings: 'key',
    })
  }
}

export const db = new LuminaNotesDB()

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  editorFontSize: 'base',
  editorFontFamily: 'sans',
  sidebarCollapsed: false,
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-personal', name: 'Personal', color: '#3B82F6', createdAt: Date.now() - 500000 },
  { id: 'cat-work', name: 'Work', color: '#10B981', createdAt: Date.now() - 400000 },
  { id: 'cat-study', name: 'Study', color: '#F59E0B', createdAt: Date.now() - 300000 },
  { id: 'cat-ideas', name: 'Ideas', color: '#8B5CF6', createdAt: Date.now() - 200000 },
  { id: 'cat-projects', name: 'Projects', color: '#EC4899', createdAt: Date.now() - 100000 },
]

export const DEFAULT_TAGS: Tag[] = [
  { id: 'tag-ideas', name: 'Ideas', color: '#8B5CF6' },
  { id: 'tag-important', name: 'Important', color: '#EF4444' },
  { id: 'tag-school', name: 'School', color: '#3B82F6' },
  { id: 'tag-programming', name: 'Programming', color: '#10B981' },
  { id: 'tag-design', name: 'Design', color: '#EC4899' },
  { id: 'tag-diary', name: 'Diary', color: '#6366F1' },
]

export const DEFAULT_NOTES: Note[] = [
  {
    id: 'note-welcome',
    title: '✨ Welcome to Lumina Notes',
    categoryId: 'cat-personal',
    tags: ['Ideas', 'Important'],
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2,
    content: `
      <h2>Welcome to your new creative sanctuary</h2>
      <p><strong>Lumina Notes</strong> is a high-precision, distraction-free personal notebook designed with the refined aesthetics of Apple Notes, Notion, and Linear.</p>
      
      <p>Everything you create here is stored <em>directly in your browser's IndexedDB database</em>. No accounts required, no telemetry, no subscription fees, and no internet latency.</p>

      <h3>⚡ Essential Keyboard Shortcuts</h3>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Press <code>Ctrl + K</code> (or <code>Cmd + K</code> on Mac) to open the <strong>Command Palette</strong></p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Type <code>#</code> and space for Heading 1, <code>##</code> for Heading 2</p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Type <code>-</code> and space for Bullet List, <code>[]</code> for Checklist</p></div></li>
        <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>Try switching to <strong>Dark Mode</strong> in the sidebar or via Command Palette</p></div></li>
      </ul>

      <blockquote>"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra</blockquote>

      <h3>🎨 Rich Formatting & Media</h3>
      <p>Highlight text to format it instantly, insert checklists, add code blocks, format quotes, or insert high-resolution images via URL or local file upload.</p>
      
      <p>Notice the <strong>Auto-Save</strong> indicator in the top right? Changes are saved seamlessly within 500ms of typing, so your thoughts are never lost.</p>
    `.trim(),
  },
  {
    id: 'note-roadmap',
    title: '🚀 Product Architecture & Roadmap',
    categoryId: 'cat-work',
    tags: ['Programming', 'Design'],
    isFavorite: true,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 5,
    content: `
      <h2>Q4 Engineering Roadmap</h2>
      <p>Core architectural pillars and milestones for Lumina Notes client-first suite:</p>

      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Three-column responsive layout with fluid transitions</p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>TipTap rich text engine with markdown extensions</p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Dexie.js IndexedDB persistence layer with reactive queries</p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Command Palette (Ctrl + K) instant navigation & actions</p></div></li>
        <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>End-to-end encrypted peer-to-peer WebRTC backup sync</p></div></li>
      </ul>

      <h3>Technical Stack Overview</h3>
      <pre><code>// Client storage layer
const db = new LuminaNotesDB();
await db.notes.put({
  id: crypto.randomUUID(),
  title: 'Client First Architecture',
  updatedAt: Date.now()
});</code></pre>

      <p>Designed for speed, resilience, and seamless offline functionality.</p>
    `.trim(),
  },
  {
    id: 'note-design',
    title: '💡 Design Principles: Soft UI & Typography',
    categoryId: 'cat-ideas',
    tags: ['Design', 'Ideas'],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 18,
    content: `
      <h2>The Soul of Editorial Interface Design</h2>
      <p>Great software should feel like high-grade stationery: quiet, responsive, and tactile without shouting for attention.</p>

      <h3>Core Axioms</h3>
      <ul>
        <li><strong>Intentional Contrast:</strong> Crisp typography against subdued slate and chalk backgrounds.</li>
        <li><strong>Micro-Affordances:</strong> Gentle transitions on hover, subtle pill borders, and precise spacing.</li>
        <li><strong>Tactile Feedback:</strong> Instant response times, smooth state transitions, and clear saving feedback.</li>
      </ul>

      <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
      <p>Keep interfaces minimal so the content can shine.</p>
    `.trim(),
  },
  {
    id: 'note-study',
    title: '📚 Distributed Systems & Local-First Software',
    categoryId: 'cat-study',
    tags: ['School', 'Programming'],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 30,
    content: `
      <h2>Why Local-First Software Matters</h2>
      <p>Local-first software combines the collaboration benefits of cloud applications with the ownership and responsiveness of classic desktop software.</p>

      <h3>Seven Ideals of Local-First Software:</h3>
      <ol>
        <li>No spinners: your work at your fingertips.</li>
        <li>Your work is not trapped on one device.</li>
        <li>The network is optional: work seamlessly offline.</li>
        <li>Seamless collaboration with peers.</li>
        <li>The long now: software that lasts for decades.</li>
        <li>Security and privacy by default.</li>
        <li>You retain ownership of your data.</li>
      </ol>
      <p>IndexedDB provides an ideal browser foundation for these principles.</p>
    `.trim(),
  },
]

export async function initDatabase(): Promise<void> {
  const categoryCount = await db.categories.count()
  if (categoryCount === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES)
  }

  const tagCount = await db.tags.count()
  if (tagCount === 0) {
    await db.tags.bulkAdd(DEFAULT_TAGS)
  }

  const noteCount = await db.notes.count()
  if (noteCount === 0) {
    await db.notes.bulkAdd(DEFAULT_NOTES)
  }

  const settingsEntry = await db.settings.get('userSettings')
  if (!settingsEntry) {
    await db.settings.put({ key: 'userSettings', value: DEFAULT_SETTINGS })
  }
}

export async function resetDatabaseToDefault(): Promise<void> {
  await db.transaction('rw', db.notes, db.categories, db.tags, db.settings, async () => {
    await db.notes.clear()
    await db.categories.clear()
    await db.tags.clear()
    await db.settings.clear()

    await db.categories.bulkAdd(DEFAULT_CATEGORIES)
    await db.tags.bulkAdd(DEFAULT_TAGS)
    await db.notes.bulkAdd(DEFAULT_NOTES)
    await db.settings.put({ key: 'userSettings', value: DEFAULT_SETTINGS })
  })
}

export async function clearAllDatabaseData(): Promise<void> {
  await db.transaction('rw', db.notes, db.categories, db.tags, async () => {
    await db.notes.clear()
    await db.categories.clear()
    await db.tags.clear()
  })
}
