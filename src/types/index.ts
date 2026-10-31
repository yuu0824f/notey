export interface Note {
  id: string
  title: string
  content: string
  categoryId: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  isArchived: boolean
  isDeleted: boolean
  createdAt: number
  updatedAt: number
}

export interface Category {
  id: string
  name: string
  color: string
  createdAt: number
}

export interface Tag {
  id: string
  name: string
  color: string
}

export type ThemeMode = 'light' | 'dark' | 'system'
export type EditorFontSize = 'sm' | 'base' | 'lg' | 'xl'
export type EditorFontFamily = 'sans' | 'serif' | 'mono'

export interface UserSettings {
  theme: ThemeMode
  editorFontSize: EditorFontSize
  editorFontFamily: EditorFontFamily
  sidebarCollapsed: boolean
}

export type SortField = 'updatedAt' | 'createdAt' | 'title'
export type SortDirection = 'asc' | 'desc'
export type SortOption = 'updatedAt-desc' | 'updatedAt-asc' | 'createdAt-desc' | 'createdAt-asc' | 'title-asc' | 'title-desc'

export type FilterOption = 'all' | 'favorites' | 'pinned'

export type ActiveView =
  | { type: 'dashboard' }
  | { type: 'all' }
  | { type: 'favorites' }
  | { type: 'recent' }
  | { type: 'archived' }
  | { type: 'trash' }
  | { type: 'category'; categoryId: string }
  | { type: 'tag'; tagName: string }
