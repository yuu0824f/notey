import React, { useState } from 'react'
import { Image as ImageIcon, Upload, X } from 'lucide-react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertImage: (url: string) => void
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, onInsertImage }) => {
  const [url, setUrl] = useState('')
  const [tab, setTab] = useState<'url' | 'upload'>('upload')

  if (!isOpen) return null

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onInsertImage(url.trim())
      setUrl('')
      onClose()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onInsertImage(reader.result)
        onClose()
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Insert Image</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-5 pt-2 gap-4 text-xs">
          <button
            onClick={() => setTab('upload')}
            className={`pb-2 font-medium border-b-2 transition-all ${
              tab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setTab('url')}
            className={`pb-2 font-medium border-b-2 transition-all ${
              tab === 'url'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Image URL
          </button>
        </div>

        <div className="p-5">
          {tab === 'upload' ? (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-indigo-500" />
                <p className="mb-1 text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-gray-400">PNG, JPG, GIF, WebP (Stored locally)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          ) : (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image Web Address
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="flex justify-end gap-2">
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
                  Insert Image
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
