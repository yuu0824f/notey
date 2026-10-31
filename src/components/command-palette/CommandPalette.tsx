import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Plus,
  Star,
  Moon,
  Sun,
  Settings as SettingsIcon,
  FileText,
  Tag as TagIcon,
  Archive,
  Trash2,
  LayoutDashboard,
} from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import { extractPlainText } from '../../utils/formatters'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  category: 'Actions' | 'Notes' | 'Categories' | 'Tags'
  action: () => void
}

export const CommandPalette: React.FC = () => {
  const {
    notes,
    categories,
    tags,
    settings,
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    selectNote,
    createNote,
    setActiveView,
    updateSettings,
    openSettingsModal,
  } = useNoteStore()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Global key listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  // Build searchable items
  const items: CommandItem[] = []

  // Static Actions
  items.push(
    {
      id: 'action-create',
      title: 'Create New Note',
      subtitle: 'Compose a fresh note',
      icon: <Plus className="w-4 h-4 text-indigo-500" />,
      category: 'Actions',
      action: () => {
        createNote()
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'action-dashboard',
      title: 'Go to Dashboard',
      subtitle: 'Open overview & analytics',
      icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
      category: 'Actions',
      action: () => {
        setActiveView({ type: 'dashboard' })
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'action-favorites',
      title: 'View Favorite Notes',
      subtitle: 'Filter by starred notes',
      icon: <Star className="w-4 h-4 text-amber-500" />,
      category: 'Actions',
      action: () => {
        setActiveView({ type: 'favorites' })
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'action-theme',
      title: `Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle interface appearance',
      icon:
        settings.theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-500" />
        ),
      category: 'Actions',
      action: () => {
        updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'action-settings',
      title: 'Open Settings',
      subtitle: 'Themes, typography, export and backups',
      icon: <SettingsIcon className="w-4 h-4 text-gray-500" />,
      category: 'Actions',
      action: () => {
        openSettingsModal()
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'action-archive',
      title: 'View Archived Notes',
      icon: <Archive className="w-4 h-4 text-purple-500" />,
      category: 'Actions',
      action: () => {
        setActiveView({ type: 'archived' })
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'action-trash',
      title: 'View Trash',
      icon: <Trash2 className="w-4 h-4 text-red-500" />,
      category: 'Actions',
      action: () => {
        setActiveView({ type: 'trash' })
        setCommandPaletteOpen(false)
      },
    }
  )

  // Matching notes
  const validNotes = notes.filter((n) => !n.isDeleted)
  validNotes.forEach((n) => {
    items.push({
      id: `note-${n.id}`,
      title: n.title || 'Untitled Note',
      subtitle: extractPlainText(n.content).slice(0, 70),
      icon: <FileText className="w-4 h-4 text-gray-400" />,
      category: 'Notes',
      action: () => {
        selectNote(n.id)
        setCommandPaletteOpen(false)
      },
    })
  })

  // Categories
  categories.forEach((c) => {
    items.push({
      id: `cat-${c.id}`,
      title: `Category: ${c.name}`,
      subtitle: `Filter notes in ${c.name}`,
      icon: (
        <span
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: c.color }}
        />
      ),
      category: 'Categories',
      action: () => {
        setActiveView({ type: 'category', categoryId: c.id })
        setCommandPaletteOpen(false)
      },
    })
  })

  // Tags
  tags.forEach((t) => {
    items.push({
      id: `tag-${t.id}`,
      title: `#${t.name}`,
      subtitle: `Filter notes tagged with #${t.name}`,
      icon: <TagIcon className="w-4 h-4 text-purple-500" />,
      category: 'Tags',
      action: () => {
        setActiveView({ type: 'tag', tagName: t.name })
        setCommandPaletteOpen(false)
      },
    })
  })

  // Filter items by query
  const filtered = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        )
      })
    : items

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    }
  }

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-black/50 backdrop-blur-xs p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search notes..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent"
        >
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400">
              No matching commands or notes found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="truncate">
                      <div className="text-xs font-semibold">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                    {item.category}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-[#181A20] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span>Lumina Command</span>
        </div>
      </div>
    </div>
  )
}
