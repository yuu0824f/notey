import React, { useRef, useState } from 'react'
import {
  Settings,
  X,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Database,
} from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import type { EditorFontSize, EditorFontFamily, ThemeMode } from '../../types'

export const SettingsModal: React.FC = () => {
  const {
    settings,
    notes,
    categories,
    tags,
    isSettingsModalOpen,
    closeSettingsModal,
    updateSettings,
    exportAllNotesAsJSON,
    importAllFromJSON,
    resetToDefaults,
    clearAllData,
  } = useNoteStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  if (!isSettingsModalOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const success = await importAllFromJSON(reader.result)
        if (success) {
          setImportStatus('Backup restored successfully!')
          setTimeout(() => setImportStatus(null), 3000)
        } else {
          setImportStatus('Failed to import backup file.')
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Preferences & Settings
            </h3>
          </div>
          <button
            onClick={closeSettingsModal}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Appearance Theme
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ theme: id as ThemeMode })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                    settings.theme === id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Settings */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Editor Font Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sm', label: 'Small' },
                { id: 'base', label: 'Medium' },
                { id: 'lg', label: 'Large' },
                { id: 'xl', label: 'Extra' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ editorFontSize: id as EditorFontSize })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    settings.editorFontSize === id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Editor Font Family
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'sans', label: 'Modern Sans', style: 'font-sans' },
                { id: 'serif', label: 'Editorial Serif', style: 'font-serif' },
                { id: 'mono', label: 'Code Mono', style: 'font-mono' },
              ].map(({ id, label, style }) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ editorFontFamily: id as EditorFontFamily })}
                  className={`py-2.5 px-3 rounded-xl border text-xs transition-all ${style} ${
                    settings.editorFontFamily === id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Storage & Backup Section */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-indigo-500" />
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Database & Backup
              </label>
            </div>

            {/* Storage status box */}
            <div className="p-3.5 bg-gray-50 dark:bg-[#181A20] rounded-xl border border-gray-200/80 dark:border-gray-700/80 text-xs text-gray-600 dark:text-gray-300 mb-4 space-y-1">
              <div className="flex justify-between">
                <span>Total Notes:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{notes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Categories / Tags:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {categories.length} / {tags.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Storage Engine:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Browser IndexedDB (Dexie)
                </span>
              </div>
            </div>

            {/* Backup & Restore Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={exportAllNotesAsJSON}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Restore Backup (JSON)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {importStatus && (
              <div className="p-2 mb-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
                {importStatus}
              </div>
            )}

            {/* Reset / Danger Zone */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm('Reset notebook to default starter notes? Current notes will be replaced.')) {
                    resetToDefaults()
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete ALL notes and categories? This cannot be undone.')) {
                    clearAllData()
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#181A20] flex justify-end shrink-0">
          <button
            onClick={closeSettingsModal}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
