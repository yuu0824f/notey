import React from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  X,
  FileQuestion,
  Trash2,
} from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import { NoteCard } from './NoteCard'
import type { SortOption, FilterOption } from '../../types'
import { extractPlainText } from '../../utils/formatters'

export const NotesList: React.FC = () => {
  const {
    notes,
    categories,
    activeView,
    activeNoteId,
    searchQuery,
    sortOption,
    filterOption,
    selectNote,
    createNote,
    setSearchQuery,
    setSortOption,
    setFilterOption,
    emptyTrash,
  } = useNoteStore()

  const [isSortMenuOpen, setIsSortMenuOpen] = React.useState(false)

  // Determine current view title
  const getViewTitle = () => {
    switch (activeView.type) {
      case 'dashboard':
        return 'Overview'
      case 'all':
        return 'All Notes'
      case 'favorites':
        return 'Favorites'
      case 'recent':
        return 'Recent Notes'
      case 'archived':
        return 'Archived Notes'
      case 'trash':
        return 'Trash'
      case 'category': {
        const cat = categories.find((c) => c.id === activeView.categoryId)
        return cat ? cat.name : 'Category'
      }
      case 'tag':
        return `#${activeView.tagName}`
      default:
        return 'Notes'
    }
  }

  // Filter notes based on active view
  let filteredNotes = notes.filter((note) => {
    if (activeView.type === 'trash') {
      return note.isDeleted
    }

    // In non-trash views, exclude deleted notes
    if (note.isDeleted) return false

    if (activeView.type === 'archived') {
      return note.isArchived
    }

    // In regular views, exclude archived notes
    if (note.isArchived) return false

    if (activeView.type === 'favorites') {
      return note.isFavorite
    }

    if (activeView.type === 'category') {
      return note.categoryId === activeView.categoryId
    }

    if (activeView.type === 'tag') {
      return note.tags.includes(activeView.tagName)
    }

    return true
  })

  // Apply secondary filter pill (All, Favorites, Pinned)
  if (activeView.type !== 'trash' && activeView.type !== 'archived') {
    if (filterOption === 'favorites') {
      filteredNotes = filteredNotes.filter((n) => n.isFavorite)
    } else if (filterOption === 'pinned') {
      filteredNotes = filteredNotes.filter((n) => n.isPinned)
    }
  }

  // Apply search query across Title, Content, and Tags
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filteredNotes = filteredNotes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(q)
      const tagsMatch = note.tags.some((tag) => tag.toLowerCase().includes(q))
      const contentMatch = extractPlainText(note.content).toLowerCase().includes(q)
      return titleMatch || tagsMatch || contentMatch
    })
  }

  // Sort notes
  filteredNotes.sort((a, b) => {
    switch (sortOption) {
      case 'updatedAt-desc':
        return b.updatedAt - a.updatedAt
      case 'updatedAt-asc':
        return a.updatedAt - b.updatedAt
      case 'createdAt-desc':
        return b.createdAt - a.createdAt
      case 'createdAt-asc':
        return a.createdAt - b.createdAt
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      default:
        return b.updatedAt - a.updatedAt
    }
  })

  // Separate pinned vs non-pinned for display (unless in trash or archived)
  const isTrashView = activeView.type === 'trash'
  const isArchivedView = activeView.type === 'archived'
  const pinnedNotes = !isTrashView && !isArchivedView ? filteredNotes.filter((n) => n.isPinned) : []
  const regularNotes = !isTrashView && !isArchivedView ? filteredNotes.filter((n) => !n.isPinned) : filteredNotes

  const handleCreateNote = () => {
    let catId: string | undefined
    let tagName: string | undefined
    if (activeView.type === 'category') catId = activeView.categoryId
    if (activeView.type === 'tag') tagName = activeView.tagName
    createNote(catId, tagName)
  }

  const sortLabels: Record<SortOption, string> = {
    'updatedAt-desc': 'Last Modified (Newest)',
    'updatedAt-asc': 'Last Modified (Oldest)',
    'createdAt-desc': 'Created Date (Newest)',
    'createdAt-asc': 'Created Date (Oldest)',
    'title-asc': 'Title (A → Z)',
    'title-desc': 'Title (Z → A)',
  }

  return (
    <section className="w-full md:w-[330px] h-screen border-r border-[#E8EAF0] dark:border-[#282C37] bg-[#F8F9FB] dark:bg-[#15171C] flex flex-col shrink-0 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-[#E8EAF0] dark:border-[#282C37] bg-white/70 dark:bg-[#1C1F26]/70 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {getViewTitle()}
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-[#282C37] text-gray-600 dark:text-gray-400">
              {filteredNotes.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isTrashView ? (
              filteredNotes.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Empty trash? All items in trash will be permanently deleted.')) {
                      emptyTrash()
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Empty
                </button>
              )
            ) : (
              <button
                onClick={handleCreateNote}
                title="New Note"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, tags, content..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-gray-100/90 dark:bg-[#282C37]/80 hover:bg-gray-200/60 dark:hover:bg-[#282C37] focus:bg-white dark:focus:bg-[#1E222B] text-gray-800 dark:text-gray-200 rounded-lg border border-transparent focus:border-indigo-500/50 outline-none transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Sort Controls */}
        <div className="flex items-center justify-between gap-1 text-xs">
          {/* Filter Pills */}
          {!isTrashView && !isArchivedView && (
            <div className="flex items-center gap-1">
              {(['all', 'favorites', 'pinned'] as FilterOption[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterOption(tab)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                    filterOption === tab
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Sort Dropdown Button */}
          <div className="relative ml-auto">
            <button
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              title="Sort Notes"
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282C37] rounded-md transition-colors"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Sort</span>
            </button>

            {isSortMenuOpen && (
              <div
                onMouseLeave={() => setIsSortMenuOpen(false)}
                className="absolute right-0 top-7 z-50 w-48 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 text-xs select-none"
              >
                <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Sort By
                </div>
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortOption(key)
                      setIsSortMenuOpen(false)
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                      sortOption === key
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{sortLabels[key]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNotes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <FileQuestion className="w-10 h-10 mb-2.5 opacity-40" />
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              No notes found
            </p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
              {searchQuery
                ? 'Try adjusting your search query or clear the filter.'
                : 'Click "New" to compose your first note.'}
            </p>
            {!isTrashView && (
              <button
                onClick={handleCreateNote}
                className="mt-4 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
              >
                + Create Note
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-1.5 mb-3">
                <div className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Pinned Notes ({pinnedNotes.length})
                </div>
                {pinnedNotes.map((note) => {
                  const cat = categories.find((c) => c.id === note.categoryId)
                  return (
                    <NoteCard
                      key={note.id}
                      note={note}
                      category={cat}
                      isSelected={activeNoteId === note.id}
                      searchQuery={searchQuery}
                      onSelect={() => selectNote(note.id)}
                    />
                  )
                })}
              </div>
            )}

            {/* Other / Regular Notes Section */}
            <div className="space-y-1.5">
              {pinnedNotes.length > 0 && regularNotes.length > 0 && (
                <div className="px-1 pt-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  All Notes ({regularNotes.length})
                </div>
              )}
              {regularNotes.map((note) => {
                const cat = categories.find((c) => c.id === note.categoryId)
                return (
                  <NoteCard
                    key={note.id}
                    note={note}
                    category={cat}
                    isSelected={activeNoteId === note.id}
                    searchQuery={searchQuery}
                    onSelect={() => selectNote(note.id)}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
