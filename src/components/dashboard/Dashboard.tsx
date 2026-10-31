import React from 'react'
import {
  FileText,
  Star,
  FolderOpen,
  Clock,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  Tag as TagIcon,
} from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import { formatRelativeTime, extractPlainText } from '../../utils/formatters'

export const Dashboard: React.FC = () => {
  const {
    notes,
    categories,
    tags,
    selectNote,
    createNote,
    openCategoryModal,
    setCommandPaletteOpen,
    setActiveView,
  } = useNoteStore()

  const validNotes = notes.filter((n) => !n.isDeleted && !n.isArchived)
  const totalNotes = validNotes.length
  const favoriteNotes = validNotes.filter((n) => n.isFavorite)
  const totalCategories = categories.length

  // Recent 5 notes sorted by updatedAt
  const recentNotes = [...validNotes]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  // Current date formatting
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#F8F9FB] dark:bg-[#15171C] p-6 sm:p-10 select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-xl shadow-indigo-500/10">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome Back to Lumina
            </h1>
            <p className="text-indigo-100/90 text-sm mt-2 max-w-xl leading-relaxed">
              Your personal knowledge workspace is synchronized and saved locally in your browser.
              Capture your next idea, project plan, or learning journal.
            </p>

            {/* Quick Actions in Banner */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => createNote()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Note</span>
              </button>

              <button
                onClick={() => openCategoryModal()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md transition-all active:scale-95"
              >
                <FolderOpen className="w-4 h-4" />
                <span>New Category</span>
              </button>

              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search Notes (Ctrl+K)</span>
              </button>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveView({ type: 'all' })}
            className="p-5 rounded-2xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37] shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
              <span className="text-xs font-medium">Total Notes</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {totalNotes}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setActiveView({ type: 'favorites' })}
            className="p-5 rounded-2xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37] shadow-xs hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
              <span className="text-xs font-medium">Favorites</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {favoriteNotes.length}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 group-hover:text-amber-500 transition-colors">
              <span>View starred</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => openCategoryModal()}
            className="p-5 rounded-2xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37] shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
              <span className="text-xs font-medium">Categories</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FolderOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {totalCategories}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
              <span>Manage folders</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setActiveView({ type: 'recent' })}
            className="p-5 rounded-2xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37] shadow-xs hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
              <span className="text-xs font-medium">Recently Edited</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {recentNotes.length}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 group-hover:text-purple-500 transition-colors">
              <span>View recent</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Lower Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notes (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Recently Edited Notes</span>
              </h3>
              <button
                onClick={() => setActiveView({ type: 'all' })}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNotes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  No notes yet. Create your first note above!
                </div>
              ) : (
                recentNotes.map((note) => {
                  const cat = categories.find((c) => c.id === note.categoryId)
                  return (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note.id)}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37] hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-start justify-between gap-4 group"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {note.title || 'Untitled Note'}
                          </h4>
                          {note.isFavorite && (
                            <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {extractPlainText(note.content) || 'Empty note...'}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0 text-[11px]">
                        <span className="text-gray-400 tabular-nums">
                          {formatRelativeTime(note.updatedAt)}
                        </span>
                        {cat && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                              backgroundColor: `${cat.color}15`,
                              color: cat.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Favorites & Tag Cloud */}
          <div className="space-y-6">
            {/* Favorites Widget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>Favorite Notes</span>
                </h3>
              </div>

              <div className="space-y-2">
                {favoriteNotes.length === 0 ? (
                  <div className="p-5 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                    Click the star icon on any note to pin it here.
                  </div>
                ) : (
                  favoriteNotes.slice(0, 4).map((note) => (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note.id)}
                      className="p-3 rounded-xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37] hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                        {note.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tag Cloud */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-purple-500" />
                  <span>Explore Tags</span>
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#1E222B] border border-[#E8EAF0] dark:border-[#282C37]">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setActiveView({ type: 'tag', tagName: tag.name })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#282C37] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>#{tag.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
