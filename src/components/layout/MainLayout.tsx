import React, { useEffect } from 'react'
import { useNoteStore } from '../../store/useNoteStore'
import { Sidebar } from './Sidebar'
import { NotesList } from '../notes/NotesList'
import { RichTextEditor } from '../editor/RichTextEditor'
import { Dashboard } from '../dashboard/Dashboard'
import { CommandPalette } from '../command-palette/CommandPalette'
import { CategoryModal } from '../modals/CategoryModal'
import { TagModal } from '../modals/TagModal'
import { SettingsModal } from '../modals/SettingsModal'

export const MainLayout: React.FC = () => {
  const { init, activeView, mobilePane } = useNoteStore()

  useEffect(() => {
    init()
  }, [init])

  const isDashboard = activeView.type === 'dashboard'

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FB] dark:bg-[#15171C] text-[#202124] dark:text-[#F3F4F6]">
      {/* 1. Left Column: Sidebar */}
      {/* On mobile: visible only when mobilePane === 'sidebar' */}
      <div
        className={`h-full ${
          mobilePane === 'sidebar' ? 'block w-full fixed inset-0 z-40' : 'hidden md:block'
        }`}
      >
        <Sidebar />
      </div>

      {/* 2. Middle & Right Content */}
      {isDashboard ? (
        // Dashboard View: Takes the rest of the screen
        <div
          className={`flex-1 h-full ${
            mobilePane === 'sidebar' ? 'hidden md:block' : 'block'
          }`}
        >
          <Dashboard />
        </div>
      ) : (
        // Standard 3-Column View: Notes List + Editor
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Notes List Column */}
          {/* On mobile: visible when mobilePane === 'list' */}
          <div
            className={`h-full shrink-0 ${
              mobilePane === 'list'
                ? 'block w-full'
                : mobilePane === 'sidebar'
                ? 'hidden'
                : 'hidden md:block'
            }`}
          >
            <NotesList />
          </div>

          {/* Editor Column */}
          {/* On mobile: visible when mobilePane === 'editor' */}
          <div
            className={`flex-1 h-full min-w-0 ${
              mobilePane === 'editor'
                ? 'block w-full'
                : mobilePane === 'sidebar' || mobilePane === 'list'
                ? 'hidden md:block'
                : 'block'
            }`}
          >
            <RichTextEditor />
          </div>
        </div>
      )}

      {/* Global Modals & Floating Overlays */}
      <CommandPalette />
      <CategoryModal />
      <TagModal />
      <SettingsModal />
    </div>
  )
}
