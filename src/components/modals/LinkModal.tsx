import React, { useState } from 'react'
import { Link2, X } from 'lucide-react'

interface LinkModalProps {
  isOpen: boolean
  initialUrl?: string
  onClose: () => void
  onSetLink: (url: string) => void
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  initialUrl = '',
  onClose,
  onSetLink,
}) => {
  const [url, setUrl] = useState(initialUrl)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSetLink(url.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Insert Link</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Destination URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
              required
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs"
            >
              Apply Link
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
