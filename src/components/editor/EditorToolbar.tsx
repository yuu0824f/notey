import React from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  CodeXml,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor | null
  onOpenImageModal: () => void
  onOpenLinkModal: () => void
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onOpenImageModal,
  onOpenLinkModal,
}) => {
  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  )

  const Separator = () => (
    <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700/60 mx-1 shrink-0" />
  )

  return (
    <div className="sticky top-0 z-20 flex items-center flex-wrap gap-0.5 px-4 py-1.5 bg-white/90 dark:bg-[#1C1F26]/90 backdrop-blur-md border-b border-[#E8EAF0] dark:border-[#282C37] select-none text-xs">
      {/* Undo & Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1 (#)"
      >
        <Heading1 className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2 (##)"
      >
        <Heading2 className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3 (###)"
      >
        <Heading3 className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator />

      {/* Basic Marks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline Code (`)"
      >
        <Code className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator />

      {/* Lists & Tasks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List (-)"
      >
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered List (1.)"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        title="Checklist ([])"
      >
        <CheckSquare className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator />

      {/* Blocks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Quote (>)"
      >
        <Quote className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block (```)"
      >
        <CodeXml className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider (---)"
      >
        <Minus className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator />

      {/* Links & Media */}
      <ToolbarButton
        onClick={onOpenLinkModal}
        isActive={editor.isActive('link')}
        title="Insert Link"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={onOpenImageModal}
        title="Insert Image"
      >
        <ImageIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
    </div>
  )
}
