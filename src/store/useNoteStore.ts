import { create } from 'zustand'
import {
  db,
  initDatabase,
  resetDatabaseToDefault,
  clearAllDatabaseData,
  DEFAULT_SETTINGS,
} from '../db'
import type {
  Note,
  Category,
  Tag,
  UserSettings,
  ActiveView,
  SortOption,
  FilterOption,
} from '../types'
import { downloadFile, htmlToMarkdown } from '../utils/formatters'

interface NoteStoreState {
  notes: Note[]
  categories: Category[]
  tags: Tag[]
  settings: UserSettings
  activeNoteId: string | null
  activeView: ActiveView
  searchQuery: string
  sortOption: SortOption
  filterOption: FilterOption
  saveStatus: 'saved' | 'saving' | 'unsaved'
  lastSavedAt: number | null

  // UI States
  isSidebarCollapsed: boolean
  mobilePane: 'sidebar' | 'list' | 'editor'
  isCommandPaletteOpen: boolean
  isSettingsModalOpen: boolean
  isCategoryModalOpen: boolean
  categoryToEdit: Category | null
  isTagModalOpen: boolean
  tagToEdit: Tag | null

  // Actions
  init: () => Promise<void>
  setActiveView: (view: ActiveView) => void
  setSearchQuery: (query: string) => void
  setSortOption: (option: SortOption) => void
  setFilterOption: (option: FilterOption) => void
  setMobilePane: (pane: 'sidebar' | 'list' | 'editor') => void
  toggleSidebar: () => void

  // Note Selection & CRUD
  selectNote: (id: string | null) => void
  createNote: (initialCategoryId?: string, initialTag?: string) => Promise<string>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  saveActiveNoteContent: (content: string, title?: string) => Promise<void>
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void
  toggleFavorite: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  toggleArchive: (id: string) => Promise<void>
  moveToTrash: (id: string) => Promise<void>
  restoreFromTrash: (id: string) => Promise<void>
  deletePermanently: (id: string) => Promise<void>
  emptyTrash: () => Promise<void>
  duplicateNote: (id: string) => Promise<string>

  // Category Actions
  openCategoryModal: (category?: Category) => void
  closeCategoryModal: () => void
  saveCategory: (name: string, color: string, id?: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  // Tag Actions
  openTagModal: (tag?: Tag) => void
  closeTagModal: () => void
  saveTag: (name: string, color: string, id?: string) => Promise<void>
  deleteTag: (id: string, name: string) => Promise<void>

  // Settings Actions
  openSettingsModal: () => void
  closeSettingsModal: () => void
  setCommandPaletteOpen: (open: boolean) => void
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>
  applyTheme: (theme: UserSettings['theme']) => void

  // Export / Import
  exportActiveNote: (format: 'md' | 'html' | 'json') => void
  exportAllNotesAsJSON: () => Promise<void>
  importAllFromJSON: (jsonString: string) => Promise<boolean>
  resetToDefaults: () => Promise<void>
  clearAllData: () => Promise<void>
}

export const useNoteStore = create<NoteStoreState>((set, get) => ({
  notes: [],
  categories: [],
  tags: [],
  settings: DEFAULT_SETTINGS,
  activeNoteId: null,
  activeView: { type: 'dashboard' },
  searchQuery: '',
  sortOption: 'updatedAt-desc',
  filterOption: 'all',
  saveStatus: 'saved',
  lastSavedAt: null,

  isSidebarCollapsed: false,
  mobilePane: 'list',
  isCommandPaletteOpen: false,
  isSettingsModalOpen: false,
  isCategoryModalOpen: false,
  categoryToEdit: null,
  isTagModalOpen: false,
  tagToEdit: null,

  init: async () => {
    try {
      await initDatabase()
      const [allNotes, allCategories, allTags, settingsRecord] = await Promise.all([
        db.notes.toArray(),
        db.categories.toArray(),
        db.tags.toArray(),
        db.settings.get('userSettings'),
      ])

      const settings = (settingsRecord?.value as UserSettings) || DEFAULT_SETTINGS
      get().applyTheme(settings.theme)

      // Find first non-deleted note to select if activeNoteId is not set
      const validNotes = allNotes.filter((n) => !n.isDeleted && !n.isArchived)
      const firstNote = validNotes.find((n) => n.isPinned) || validNotes[0]

      set({
        notes: allNotes,
        categories: allCategories,
        tags: allTags,
        settings,
        isSidebarCollapsed: settings.sidebarCollapsed ?? false,
        activeNoteId: firstNote ? firstNote.id : null,
      })
    } catch (err) {
      console.error('Failed to initialize database:', err)
    }
  },

  applyTheme: (theme) => {
    const root = document.documentElement
    let isDark = false
    if (theme === 'dark') {
      isDark = true
    } else if (theme === 'light') {
      isDark = false
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  },

  setActiveView: (view) => {
    set({
      activeView: view,
      mobilePane: view.type === 'dashboard' ? 'list' : 'list',
    })
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOption: (option) => set({ sortOption: option }),
  setFilterOption: (option) => set({ filterOption: option }),
  setMobilePane: (pane) => set({ mobilePane: pane }),
  toggleSidebar: () => {
    const newState = !get().isSidebarCollapsed
    set({ isSidebarCollapsed: newState })
    get().updateSettings({ sidebarCollapsed: newState })
  },

  selectNote: (id) => {
    set({ activeNoteId: id, mobilePane: 'editor' })
  },

  createNote: async (initialCategoryId, initialTag) => {
    const { categories } = get()
    const defaultCat = initialCategoryId || (categories[0]?.id ?? 'cat-personal')
    const initialTags = initialTag ? [initialTag] : []

    const newNote: Note = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: 'Untitled Note',
      content: '<p></p>',
      categoryId: defaultCat,
      tags: initialTags,
      isFavorite: false,
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await db.notes.add(newNote)
    set((state) => ({
      notes: [newNote, ...state.notes],
      activeNoteId: newNote.id,
      activeView: state.activeView.type === 'trash' ? { type: 'all' } : state.activeView,
      mobilePane: 'editor',
    }))

    return newNote.id
  },

  updateNote: async (id, updates) => {
    const updatedAt = Date.now()
    const merged = { ...updates, updatedAt }
    await db.notes.update(id, merged)

    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...merged } : n)),
    }))
  },

  setSaveStatus: (status) => set({ saveStatus: status }),

  saveActiveNoteContent: async (content, title) => {
    const { activeNoteId, notes } = get()
    if (!activeNoteId) return

    const currentNote = notes.find((n) => n.id === activeNoteId)
    if (!currentNote) return

    set({ saveStatus: 'saving' })

    const updates: Partial<Note> = {
      content,
      updatedAt: Date.now(),
    }
    if (typeof title === 'string') {
      updates.title = title.trim() || 'Untitled Note'
    }

    await db.notes.update(activeNoteId, updates)

    set((state) => ({
      notes: state.notes.map((n) => (n.id === activeNoteId ? { ...n, ...updates } : n)),
      saveStatus: 'saved',
      lastSavedAt: Date.now(),
    }))
  },

  toggleFavorite: async (id) => {
    const note = get().notes.find((n) => n.id === id)
    if (!note) return
    const isFavorite = !note.isFavorite
    await get().updateNote(id, { isFavorite })
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id)
    if (!note) return
    const isPinned = !note.isPinned
    await get().updateNote(id, { isPinned })
  },

  toggleArchive: async (id) => {
    const note = get().notes.find((n) => n.id === id)
    if (!note) return
    const isArchived = !note.isArchived
    await get().updateNote(id, { isArchived })

    // If active note was archived and we're not in archived view, advance selection
    if (get().activeNoteId === id && get().activeView.type !== 'archived') {
      const remaining = get().notes.filter((n) => n.id !== id && !n.isDeleted && !n.isArchived)
      set({ activeNoteId: remaining[0]?.id ?? null })
    }
  },

  moveToTrash: async (id) => {
    await get().updateNote(id, { isDeleted: true })
    if (get().activeNoteId === id) {
      const remaining = get().notes.filter((n) => n.id !== id && !n.isDeleted)
      set({ activeNoteId: remaining[0]?.id ?? null })
    }
  },

  restoreFromTrash: async (id) => {
    await get().updateNote(id, { isDeleted: false })
  },

  deletePermanently: async (id) => {
    await db.notes.delete(id)
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    }))
  },

  emptyTrash: async () => {
    const trashIds = get().notes.filter((n) => n.isDeleted).map((n) => n.id)
    await db.notes.bulkDelete(trashIds)
    set((state) => ({
      notes: state.notes.filter((n) => !n.isDeleted),
      activeNoteId: trashIds.includes(state.activeNoteId || '') ? null : state.activeNoteId,
    }))
  },

  duplicateNote: async (id) => {
    const original = get().notes.find((n) => n.id === id)
    if (!original) return ''

    const duplicated: Note = {
      ...original,
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${original.title} (Copy)`,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await db.notes.add(duplicated)
    set((state) => ({
      notes: [duplicated, ...state.notes],
      activeNoteId: duplicated.id,
      mobilePane: 'editor',
    }))

    return duplicated.id
  },

  // Categories
  openCategoryModal: (category) => {
    set({ isCategoryModalOpen: true, categoryToEdit: category || null })
  },
  closeCategoryModal: () => {
    set({ isCategoryModalOpen: false, categoryToEdit: null })
  },
  saveCategory: async (name, color, id) => {
    if (id) {
      await db.categories.update(id, { name, color })
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? { ...c, name, color } : c)),
        isCategoryModalOpen: false,
        categoryToEdit: null,
      }))
    } else {
      const newCat: Category = {
        id: 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name,
        color,
        createdAt: Date.now(),
      }
      await db.categories.add(newCat)
      set((state) => ({
        categories: [...state.categories, newCat],
        isCategoryModalOpen: false,
        categoryToEdit: null,
      }))
    }
  },
  deleteCategory: async (id) => {
    await db.categories.delete(id)
    const fallbackCatId = get().categories.find((c) => c.id !== id)?.id || ''
    // Update notes using this category
    const affectedNotes = get().notes.filter((n) => n.categoryId === id)
    for (const note of affectedNotes) {
      await db.notes.update(note.id, { categoryId: fallbackCatId })
    }

    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      notes: state.notes.map((n) => (n.categoryId === id ? { ...n, categoryId: fallbackCatId } : n)),
      activeView:
        state.activeView.type === 'category' && state.activeView.categoryId === id
          ? { type: 'all' }
          : state.activeView,
    }))
  },

  // Tags
  openTagModal: (tag) => {
    set({ isTagModalOpen: true, tagToEdit: tag || null })
  },
  closeTagModal: () => {
    set({ isTagModalOpen: false, tagToEdit: null })
  },
  saveTag: async (name, color, id) => {
    const cleanName = name.replace(/^#/, '').trim()
    if (!cleanName) return

    if (id) {
      const oldTag = get().tags.find((t) => t.id === id)
      await db.tags.update(id, { name: cleanName, color })
      // If tag name changed, update notes with that tag
      if (oldTag && oldTag.name !== cleanName) {
        const updatedNotes = get().notes.map((n) => ({
          ...n,
          tags: n.tags.map((t) => (t === oldTag.name ? cleanName : t)),
        }))
        for (const n of updatedNotes) {
          await db.notes.update(n.id, { tags: n.tags })
        }
        set({ notes: updatedNotes })
      }

      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? { ...t, name: cleanName, color } : t)),
        isTagModalOpen: false,
        tagToEdit: null,
      }))
    } else {
      const newTag: Tag = {
        id: 'tag_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: cleanName,
        color,
      }
      await db.tags.add(newTag)
      set((state) => ({
        tags: [...state.tags, newTag],
        isTagModalOpen: false,
        tagToEdit: null,
      }))
    }
  },
  deleteTag: async (id, name) => {
    await db.tags.delete(id)
    // Remove tag from notes
    const updatedNotes = get().notes.map((n) => ({
      ...n,
      tags: n.tags.filter((t) => t !== name),
    }))
    for (const n of updatedNotes) {
      await db.notes.update(n.id, { tags: n.tags })
    }

    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
      notes: updatedNotes,
      activeView:
        state.activeView.type === 'tag' && state.activeView.tagName === name
          ? { type: 'all' }
          : state.activeView,
    }))
  },

  // Settings
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  updateSettings: async (updates) => {
    const newSettings = { ...get().settings, ...updates }
    await db.settings.put({ key: 'userSettings', value: newSettings })
    if (updates.theme) {
      get().applyTheme(updates.theme)
    }
    set({ settings: newSettings })
  },

  // Export
  exportActiveNote: (format) => {
    const { activeNoteId, notes } = get()
    if (!activeNoteId) return
    const note = notes.find((n) => n.id === activeNoteId)
    if (!note) return

    const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '_') || 'note'

    if (format === 'md') {
      const markdown = htmlToMarkdown(note.content, note.title)
      downloadFile(markdown, `${sanitizedTitle}.md`, 'text/markdown;charset=utf-8')
    } else if (format === 'html') {
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${note.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #202124; }
    h1, h2, h3 { color: #111827; }
    blockquote { border-left: 4px solid #6366F1; padding-left: 1rem; color: #4B5563; font-style: italic; }
    pre { background: #1F2937; color: #F9FAFB; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  ${note.content}
</body>
</html>`
      downloadFile(fullHtml, `${sanitizedTitle}.html`, 'text/html;charset=utf-8')
    } else if (format === 'json') {
      const json = JSON.stringify(note, null, 2)
      downloadFile(json, `${sanitizedTitle}.json`, 'application/json')
    }
  },

  exportAllNotesAsJSON: async () => {
    const [allNotes, allCategories, allTags, settingsRecord] = await Promise.all([
      db.notes.toArray(),
      db.categories.toArray(),
      db.tags.toArray(),
      db.settings.get('userSettings'),
    ])

    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notes: allNotes,
      categories: allCategories,
      tags: allTags,
      settings: settingsRecord?.value || DEFAULT_SETTINGS,
    }

    const json = JSON.stringify(backup, null, 2)
    const timestamp = new Date().toISOString().slice(0, 10)
    downloadFile(json, `lumina-notes-backup-${timestamp}.json`, 'application/json')
  },

  importAllFromJSON: async (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      if (!Array.isArray(data.notes)) {
        throw new Error('Invalid backup file format')
      }

      await db.transaction('rw', db.notes, db.categories, db.tags, db.settings, async () => {
        if (data.notes && data.notes.length) {
          await db.notes.clear()
          await db.notes.bulkAdd(data.notes)
        }
        if (data.categories && data.categories.length) {
          await db.categories.clear()
          await db.categories.bulkAdd(data.categories)
        }
        if (data.tags && data.tags.length) {
          await db.tags.clear()
          await db.tags.bulkAdd(data.tags)
        }
        if (data.settings) {
          await db.settings.put({ key: 'userSettings', value: data.settings })
        }
      })

      // Reload store
      await get().init()
      return true
    } catch (err) {
      console.error('Failed to import backup:', err)
      return false
    }
  },

  resetToDefaults: async () => {
    await resetDatabaseToDefault()
    await get().init()
  },

  clearAllData: async () => {
    await clearAllDatabaseData()
    set({
      notes: [],
      categories: [],
      tags: [],
      activeNoteId: null,
      activeView: { type: 'all' },
    })
  },
}))
