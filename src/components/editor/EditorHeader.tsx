import React, { useState, useRef, useEffect } from 'react'
import {
  Star,
  Pin,
  Archive,
  Trash2,
  Copy,
  Download,
  Printer,
  ChevronLeft,
  Check,
  Loader2,
  MoreVertical,
  Plus,
  X,
} from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import type { Note, Category } from '../../types'

interface EditorHeaderProps {
  note: Note
  title: string
  onTitleChange: (newTitle: string) => void
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  note,
  title,
  onTitleChange,
}) => {
  const {
    categories,
    tags,
    saveStatus,
    updateNote,
    toggleFavorite,
    togglePin,
    toggleArchive,
    moveToTrash,
    duplicateNote,
    exportActiveNote,
    setMobilePane,
  } = useNoteStore()

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false)
  const [isTagInputOpen, setIsTagInputOpen] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')

  const moreMenuRef = useRef<HTMLDivElement>(null)
  const catPickerRef = useRef<HTMLDivElement>(null)
  const tagPickerRef = useRef<HTMLDivElement>(null)

  const currentCategory = categories.find((c) => c.id === note.categoryId)

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false)
      }
      if (catPickerRef.current && !catPickerRef.current.contains(e.target as Node)) {
        setIsCategoryPickerOpen(false)
      }
      if (tagPickerRef.current && !tagPickerRef.current.contains(e.target as Node)) {
        setIsTagInputOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddTag = (tagName: string) => {
    const clean = tagName.replace(/^#/, '').trim()
    if (!clean) return
    if (!note.tags.includes(clean)) {
      updateNote(note.id, { tags: [...note.tags, clean] })
    }
    setNewTagInput('')
    setIsTagInputOpen(false)
  }

  const handleRemoveTag = (tagName: string) => {
    updateNote(note.id, { tags: note.tags.filter((t) => t !== tagName) })
  }

  return (
    <header className="px-6 pt-5 pb-3 border-b border-[#E8EAF0] dark:border-[#282C37] bg-white dark:bg-[#1C1F26] transition-colors select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Mobile Back Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobilePane('list')}
            className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#282C37] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Category Selector Pill */}
          <div className="relative" ref={catPickerRef}>
            <button
              onClick={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#282C37] text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: currentCategory?.color || '#9CA3AF' }}
              />
              <span>{currentCategory?.name || 'Uncategorized'}</span>
            </button>

            {/* Category Dropdown */}
            {isCategoryPickerOpen && (
              <div className="absolute left-0 top-8 z-50 w-44 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 text-xs select-none">
                <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Select Category
                </div>
                {categories.map((c: Category) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      updateNote(note.id, { categoryId: c.id })
                      setIsCategoryPickerOpen(false)
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      note.categoryId === c.id
                        ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>{c.name}</span>
                    </div>
                    {note.categoryId === c.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-1">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-gray-400 dark:text-gray-500 font-medium mr-1">
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                <span className="text-indigo-500">Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Saved</span>
              </>
            )}
          </div>

          {/* Pin Toggle */}
          <button
            onClick={() => togglePin(note.id)}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282C37]'
            }`}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavorite(note.id)}
            title={note.isFavorite ? 'Remove favorite' : 'Mark favorite'}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isFavorite
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-[#282C37]'
            }`}
          >
            <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* More Menu Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              title="More actions"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-8 z-50 w-52 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 text-xs select-none">
                <button
                  onClick={() => {
                    exportActiveNote('md')
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  Export as Markdown (.md)
                </button>
                <button
                  onClick={() => {
                    exportActiveNote('html')
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  Export as HTML (.html)
                </button>
                <button
                  onClick={() => {
                    exportActiveNote('json')
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  Export as JSON (.json)
                </button>
                <button
                  onClick={() => {
                    window.print()
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-400" />
                  Print / Save to PDF
                </button>

                <div className="h-[1px] bg-gray-100 dark:bg-gray-700/60 my-1" />

                <button
                  onClick={() => {
                    duplicateNote(note.id)
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  Duplicate Note
                </button>
                <button
                  onClick={() => {
                    toggleArchive(note.id)
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <Archive className="w-3.5 h-3.5 text-gray-400" />
                  {note.isArchived ? 'Unarchive' : 'Archive Note'}
                </button>

                <div className="h-[1px] bg-gray-100 dark:bg-gray-700/60 my-1" />

                <button
                  onClick={() => {
                    moveToTrash(note.id)
                    setIsMoreMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Title Input */}
      <div className="mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Note..."
          className="w-full text-2xl font-bold bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none tracking-tight border-none p-0 focus:ring-0"
        />
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-[#282C37] text-gray-700 dark:text-gray-300 group"
          >
            <span>#{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}

        {/* Add Tag Button / Input */}
        <div className="relative" ref={tagPickerRef}>
          {isTagInputOpen ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag(newTagInput)
                  if (e.key === 'Escape') setIsTagInputOpen(false)
                }}
                placeholder="Tag name..."
                autoFocus
                className="w-24 px-2 py-0.5 text-[11px] rounded-full border border-indigo-400 dark:border-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none"
              />
              <button
                onClick={() => handleAddTag(newTagInput)}
                className="p-1 rounded-full bg-indigo-600 text-white"
              >
                <Check className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsTagInputOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-[#282C37] border border-dashed border-gray-300 dark:border-gray-700 transition-colors"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Add tag</span>
            </button>
          )}

          {/* Quick existing tag suggestions */}
          {isTagInputOpen && tags.length > 0 && (
            <div className="absolute left-0 top-7 z-50 w-36 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 text-xs">
              <div className="px-2 py-1 text-[10px] text-gray-400 uppercase font-semibold">
                Existing Tags
              </div>
              {tags
                .filter((t) => !note.tags.includes(t.name))
                .slice(0, 5)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleAddTag(t.name)}
                    className="w-full px-2.5 py-1 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>#{t.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
