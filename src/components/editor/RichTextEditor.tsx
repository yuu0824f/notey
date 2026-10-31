import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { PenLine, Plus, Clock, BookOpen } from 'lucide-react'

import { useNoteStore } from '../../store/useNoteStore'
import { EditorToolbar } from './EditorToolbar'
import { EditorHeader } from './EditorHeader'
import { ImageModal } from '../modals/ImageModal'
import { LinkModal } from '../modals/LinkModal'
import { getStats } from '../../utils/formatters'

export const RichTextEditor: React.FC = () => {
  const {
    notes,
    activeNoteId,
    settings,
    saveActiveNoteContent,
    createNote,
  } = useNoteStore()

  const currentNote = notes.find((n) => n.id === activeNoteId)

  // Local title state for immediate response
  const [title, setTitle] = useState(currentNote?.title || '')

  // Modals
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)

  // Auto-save debounce timer ref
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingContentRef = useRef<string | null>(null)
  const pendingTitleRef = useRef<string | null>(null)

  // Editor instance setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400 cursor-pointer',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 shadow-sm border border-gray-200 dark:border-gray-700',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your thoughts, use markdown shortcuts (# for header, - for list, [] for tasks)...',
      }),
    ],
    content: currentNote ? currentNote.content : '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      pendingContentRef.current = html
      triggerDebouncedSave()
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px] prose dark:prose-invert max-w-none py-6 px-8',
      },
    },
  })

  // Flush pending changes to store & database immediately
  const flushPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }

    const contentToSave = pendingContentRef.current
    const titleToSave = pendingTitleRef.current

    if (contentToSave !== null || titleToSave !== null) {
      saveActiveNoteContent(
        contentToSave ?? (editor ? editor.getHTML() : ''),
        titleToSave ?? title
      )
      pendingContentRef.current = null
      pendingTitleRef.current = null
    }
  }, [editor, saveActiveNoteContent, title])

  // Trigger 500ms debounced save
  const triggerDebouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      flushPendingSave()
    }, 500)
  }, [flushPendingSave])

  // Sync editor content and title when active note changes
  useEffect(() => {
    // Flush any pending save for previous note first
    flushPendingSave()

    if (currentNote) {
      setTitle(currentNote.title)
      pendingTitleRef.current = null
      pendingContentRef.current = null

      if (editor && editor.getHTML() !== currentNote.content) {
        editor.commands.setContent(currentNote.content, { emitUpdate: false })
      }
    }
  }, [currentNote?.id]) // Run when note ID changes

  // Save on component unmount
  useEffect(() => {
    return () => {
      flushPendingSave()
    }
  }, [flushPendingSave])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    pendingTitleRef.current = newTitle
    triggerDebouncedSave()
  }

  const handleInsertImage = (url: string) => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleSetLink = (url: string) => {
    if (!editor) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // Calculate typography styling classes from user settings
  const getFontSizeClass = () => {
    switch (settings.editorFontSize) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'xl':
        return 'text-xl'
      default:
        return 'text-base'
    }
  }

  const getFontFamilyClass = () => {
    switch (settings.editorFontFamily) {
      case 'serif':
        return 'font-serif'
      case 'mono':
        return 'font-mono'
      default:
        return 'font-sans'
    }
  }

  // Calculate stats for current note
  const stats = currentNote ? getStats(currentNote.content) : { words: 0, characters: 0, readingTime: 1 }

  if (!currentNote) {
    return (
      <main className="flex-1 h-screen bg-[#F8F9FB] dark:bg-[#15171C] flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          No Note Selected
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mb-6 leading-relaxed">
          Select a note from the list on the left to start editing, or create a new one to capture your thoughts.
        </p>
        <button
          onClick={() => createNote()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Note</span>
        </button>
      </main>
    )
  }

  return (
    <main className="flex-1 h-screen bg-[#F8F9FB] dark:bg-[#15171C] flex flex-col overflow-hidden">
      {/* Editor Header: Title, Category, Tags, Meta Actions */}
      <EditorHeader
        note={currentNote}
        title={title}
        onTitleChange={handleTitleChange}
      />

      {/* TipTap Sticky Formatting Toolbar */}
      <EditorToolbar
        editor={editor}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
      />

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className={`max-w-3xl mx-auto ${getFontSizeClass()} ${getFontFamilyClass()}`}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Editor Bottom Meta Bar */}
      <footer className="px-6 py-2 border-t border-[#E8EAF0] dark:border-[#282C37] bg-white/70 dark:bg-[#1C1F26]/70 backdrop-blur-md flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 select-none">
        <div className="flex items-center gap-4">
          <span>{stats.words} words</span>
          <span>{stats.characters} characters</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{stats.readingTime} min read</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
          <PenLine className="w-3 h-3 text-indigo-500" />
          <span>Markdown shortcuts active</span>
        </div>
      </footer>

      {/* Modals for media */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertImage={handleInsertImage}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        initialUrl={editor?.getAttributes('link').href || ''}
        onClose={() => setIsLinkModalOpen(false)}
        onSetLink={handleSetLink}
      />
    </main>
  )
}
