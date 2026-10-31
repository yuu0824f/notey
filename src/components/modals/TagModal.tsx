import React, { useState, useEffect } from 'react'
import { Tag as TagIcon, X } from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'

const TAG_COLOR_PRESETS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#64748B', // Slate
]

export const TagModal: React.FC = () => {
  const { isTagModalOpen, tagToEdit, closeTagModal, saveTag } = useNoteStore()

  const [name, setName] = useState('')
  const [color, setColor] = useState(TAG_COLOR_PRESETS[0])

  useEffect(() => {
    if (tagToEdit) {
      setName(tagToEdit.name)
      setColor(tagToEdit.color)
    } else {
      setName('')
      setColor(TAG_COLOR_PRESETS[0])
    }
  }, [tagToEdit, isTagModalOpen])

  if (!isTagModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    saveTag(name.trim(), color, tagToEdit?.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {tagToEdit ? 'Edit Tag' : 'New Tag'}
            </h3>
          </div>
          <button
            onClick={closeTagModal}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tag Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                #
              </span>
              <input
                type="text"
                placeholder="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tag Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {TAG_COLOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setColor(preset)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === preset ? 'scale-110 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeTagModal}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs"
            >
              {tagToEdit ? 'Save Changes' : 'Create Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
