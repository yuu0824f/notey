import React from 'react'
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Star,
  Clock,
  Archive,
  Trash2,
  Plus,
  Settings as SettingsIcon,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  MoreVertical,
  Edit2,
} from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import type { Category, Tag } from '../../types'

export const Sidebar: React.FC = () => {
  const {
    notes,
    categories,
    tags,
    settings,
    activeView,
    isSidebarCollapsed,
    setActiveView,
    toggleSidebar,
    updateSettings,
    openSettingsModal,
    openCategoryModal,
    deleteCategory,
    openTagModal,
    deleteTag,
  } = useNoteStore()

  // Calculate live counts
  const allNotesCount = notes.filter((n) => !n.isDeleted && !n.isArchived).length
  const favoritesCount = notes.filter((n) => !n.isDeleted && !n.isArchived && n.isFavorite).length
  const recentCount = notes.filter((n) => !n.isDeleted && !n.isArchived).length
  const archivedCount = notes.filter((n) => !n.isDeleted && n.isArchived).length
  const trashCount = notes.filter((n) => n.isDeleted).length

  const getCategoryCount = (catId: string) =>
    notes.filter((n) => !n.isDeleted && !n.isArchived && n.categoryId === catId).length

  const getTagCount = (tagName: string) =>
    notes.filter((n) => !n.isDeleted && !n.isArchived && n.tags.includes(tagName)).length

  // Quick category menu state
  const [activeCategoryMenu, setActiveCategoryMenu] = React.useState<string | null>(null)
  const [activeTagMenu, setActiveTagMenu] = React.useState<string | null>(null)

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark'
    updateSettings({ theme: nextTheme })
  }

  if (isSidebarCollapsed) {
    return (
      <aside className="w-14 h-screen border-r border-[#E8EAF0] dark:border-[#282C37] bg-white dark:bg-[#1C1F26] flex flex-col items-center py-4 justify-between transition-all duration-300 z-30 select-none">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={toggleSidebar}
            title="Expand Sidebar"
            className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-colors"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="w-8 h-[1px] bg-gray-200 dark:bg-[#282C37] my-1" />
          <button
            onClick={() => setActiveView({ type: 'dashboard' })}
            title="Dashboard"
            className={`p-2 rounded-lg transition-colors ${
              activeView.type === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#282C37]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveView({ type: 'all' })}
            title="All Notes"
            className={`p-2 rounded-lg transition-colors ${
              activeView.type === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#282C37]'
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveView({ type: 'favorites' })}
            title="Favorites"
            className={`p-2 rounded-lg transition-colors ${
              activeView.type === 'favorites'
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#282C37]'
            }`}
          >
            <Star className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={toggleTheme}
            title={settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-colors"
          >
            {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={openSettingsModal}
            title="Settings"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-[260px] h-screen border-r border-[#E8EAF0] dark:border-[#282C37] bg-white dark:bg-[#1C1F26] flex flex-col justify-between shrink-0 select-none z-30 transition-all duration-300">
      {/* Top Header */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b border-[#E8EAF0]/60 dark:border-[#282C37]/60">
          <div
            onClick={() => setActiveView({ type: 'dashboard' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-gray-100">
                Lumina Notes
              </span>
              <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Personal Edition
              </span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282C37] rounded-lg transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="px-3 py-3 space-y-1">
          <button
            onClick={() => setActiveView({ type: 'dashboard' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView.type === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveView({ type: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView.type === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>All Notes</span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              {allNotesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView({ type: 'favorites' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView.type === 'favorites'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Favorites</span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              {favoritesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView({ type: 'recent' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView.type === 'recent'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Recent</span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              {recentCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView({ type: 'archived' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView.type === 'archived'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-purple-500" />
              <span>Archived</span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              {archivedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView({ type: 'trash' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView.type === 'trash'
                ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold shadow-xs'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Trash</span>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              {trashCount}
            </span>
          </button>
        </div>

        {/* Categories Section */}
        <div className="mt-4 px-3">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Categories
            </span>
            <button
              onClick={() => openCategoryModal()}
              title="Add Category"
              className="p-1 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {categories.map((cat: Category) => {
              const isSelected =
                activeView.type === 'category' && activeView.categoryId === cat.id
              const count = getCategoryCount(cat.id)
              const isMenuOpen = activeCategoryMenu === cat.id

              return (
                <div key={cat.id} className="relative group">
                  <button
                    onClick={() => setActiveView({ type: 'category', categoryId: cat.id })}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282C37]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-400 group-hover:hidden tabular-nums">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveCategoryMenu(isMenuOpen ? null : cat.id)
                        }}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                  </button>

                  {/* Context Menu for Category */}
                  {isMenuOpen && (
                    <div
                      onMouseLeave={() => setActiveCategoryMenu(null)}
                      className="absolute right-2 top-8 z-50 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 w-28 text-xs"
                    >
                      <button
                        onClick={() => {
                          openCategoryModal(cat)
                          setActiveCategoryMenu(null)
                        }}
                        className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3 text-gray-400" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"? Notes will be retained.`)) {
                            deleteCategory(cat.id)
                          }
                          setActiveCategoryMenu(null)
                        }}
                        className="w-full px-3 py-1.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Tags Section */}
        <div className="mt-5 px-3">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Tags
            </span>
            <button
              onClick={() => openTagModal()}
              title="Add Tag"
              className="p-1 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-[#282C37] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 px-1 py-1">
            {tags.map((tag: Tag) => {
              const isSelected = activeView.type === 'tag' && activeView.tagName === tag.name
              const count = getTagCount(tag.name)
              const isMenuOpen = activeTagMenu === tag.id

              return (
                <div key={tag.id} className="relative group">
                  <button
                    onClick={() => setActiveView({ type: 'tag', tagName: tag.name })}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-[#282C37] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? '#ffffff' : tag.color }}
                    />
                    <span>#{tag.name}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTagMenu(isMenuOpen ? null : tag.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-0.5 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      •
                    </span>
                  </button>

                  {/* Menu for tag */}
                  {isMenuOpen && (
                    <div
                      onMouseLeave={() => setActiveTagMenu(null)}
                      className="absolute left-0 top-7 z-50 bg-white dark:bg-[#1E222B] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 w-24 text-xs"
                    >
                      <button
                        onClick={() => {
                          openTagModal(tag)
                          setActiveTagMenu(null)
                        }}
                        className="w-full px-2.5 py-1 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3 text-gray-400" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete tag "#${tag.name}"?`)) {
                            deleteTag(tag.id, tag.name)
                          }
                          setActiveTagMenu(null)
                        }}
                        className="w-full px-2.5 py-1 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer Features */}
      <div className="p-3 border-t border-[#E8EAF0] dark:border-[#282C37] bg-gray-50/50 dark:bg-[#1C1F26]/60">
        {/* Storage status */}
        <div className="px-2 py-1.5 mb-2 text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-between">
          <span>Storage</span>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {notes.length} notes • IndexedDB
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-[#282C37] transition-colors"
          >
            {settings.theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            onClick={openSettingsModal}
            title="Settings"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-[#282C37] transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
