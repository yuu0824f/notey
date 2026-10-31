import React from 'react'
import {
  Star,
  Pin,
  Archive,
  Trash2,
  Copy,
  RotateCcw,
  MoreHorizontal,
} from 'lucide-react'
import type { Note, Category } from '../../types'
import { formatRelativeTime, extractPlainText } from '../../utils/formatters'
import { useNoteStore } from '../../store/useNoteStore'

interface NoteCardProps {
  note: Note
  category?: Category
  isSelected: boolean
  searchQuery: string
  onSelect: () => void
}

/**
 * Helper to highlight matching search words
 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <span>{text}</span>

  const parts = text.split(new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-200 dark:bg-amber-600/40 text-gray-900 dark:text-amber-100 rounded-xs px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  category,
  isSelected,
  searchQuery,
  onSelect,
}) => {
  const {
    toggleFavorite,
    togglePin,
    toggleArchive,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    duplicateNote,
  } = useNoteStore()

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close context menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const plainContent = extractPlainText(note.content)

  return (
    <div
      onClick={onSelect}
      className={`group relative p-3.5 rounded-xl cursor-pointer transition-all duration-200 border text-left ${
        isSelected
          ? 'bg-white dark:bg-[#1E222B] border-indigo-500/50 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/20'
          : 'bg-white/60 dark:bg-[#1C1F26]/60 hover:bg-white dark:hover:bg-[#1E222B] border-[#E8EAF0] dark:border-[#282C37] hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      {/* Top Header: Title & Actions */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 leading-snug">
          <HighlightText text={note.title || 'Untitled Note'} query={searchQuery} />
        </h4>

        <div className="flex items-center gap-1 shrink-0 -mt-0.5">
          {/* Pin Button */}
          {!note.isDeleted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                togglePin(note.id)
              }}
              title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
              className={`p-1 rounded-md transition-colors ${
                note.isPinned
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Favorite Button */}
          {!note.isDeleted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(note.id)
              }}
              title={note.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
              className={`p-1 rounded-md transition-colors ${
                note.isFavorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-amber-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* More options menu button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="p-1 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-all"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-6 z-50 w-40 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 text-xs select-none"
              >
                {!note.isDeleted ? (
                  <>
                    <button
                      onClick={() => {
                        duplicateNote(note.id)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        togglePin(note.id)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                    >
                      <Pin className="w-3.5 h-3.5 text-gray-400" />
                      {note.isPinned ? 'Unpin' : 'Pin to Top'}
                    </button>
                    <button
                      onClick={() => {
                        toggleArchive(note.id)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                    >
                      <Archive className="w-3.5 h-3.5 text-gray-400" />
                      {note.isArchived ? 'Unarchive' : 'Archive'}
                    </button>
                    <div className="h-[1px] bg-gray-100 dark:bg-gray-700/50 my-1" />
                    <button
                      onClick={() => {
                        moveToTrash(note.id)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Move to Trash
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        restoreFromTrash(note.id)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Note
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete this note? This cannot be undone.')) {
                          deletePermanently(note.id)
                        }
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Forever
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
        {plainContent ? (
          <HighlightText text={plainContent} query={searchQuery} />
        ) : (
          <span className="italic text-gray-400">Empty note...</span>
        )}
      </p>

      {/* Footer Meta: Category, Tags & Timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-gray-100 dark:border-[#282C37]/80 text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {category && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{
                backgroundColor: `${category.color}18`,
                color: category.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </span>
          )}

          {note.tags?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="inline-block text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#282C37] px-1.5 py-0.5 rounded"
            >
              #{t}
            </span>
          ))}
          {note.tags && note.tags.length > 2 && (
            <span className="text-[10px] text-gray-400">+{note.tags.length - 2}</span>
          )}
        </div>

        <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 tabular-nums">
          {formatRelativeTime(note.updatedAt)}
        </span>
      </div>
    </div>
  )
}
