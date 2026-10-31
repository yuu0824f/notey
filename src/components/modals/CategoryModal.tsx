import React, { useState, useEffect } from 'react'
import { Folder, X } from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'

const COLOR_PRESETS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#64748B', // Slate
]

export const CategoryModal: React.FC = () => {
  const { isCategoryModalOpen, categoryToEdit, closeCategoryModal, saveCategory } =
    useNoteStore()

  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_PRESETS[0])

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name)
      setColor(categoryToEdit.color)
    } else {
      setName('')
      setColor(COLOR_PRESETS[0])
    }
  }, [categoryToEdit, isCategoryModalOpen])

  if (!isCategoryModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    saveCategory(name.trim(), color, categoryToEdit?.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {categoryToEdit ? 'Edit Category' : 'New Category'}
            </h3>
          </div>
          <button
            onClick={closeCategoryModal}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Work, Research, Personal..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => (
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
              onClick={closeCategoryModal}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs"
            >
              {categoryToEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
