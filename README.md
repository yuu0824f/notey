# ✨ Lumina Notes — Premium Personal Notebook Web App

> A minimalist, editorial-grade personal notebook application crafted with React, TypeScript, Vite, Tailwind CSS, TipTap Rich Text Engine, and IndexedDB persistence.

Inspired by **Apple Notes, Notion, Obsidian, Linear, and Craft**, Lumina Notes is a fully functional, local-first web app that requires **no servers, no logins, and zero paid APIs**. All data is securely stored directly in your browser's IndexedDB and persists across reloads.

---

## 🌟 Key Features

### 1. 📐 Three-Column Responsive Layout
- **Left Sidebar (~260px)**: Brand logo, navigation (Dashboard, All Notes, Favorites, Recent, Archived, Trash), Categories manager with custom colors, and Tags manager.
- **Center Notes List (~330px)**: Fast search with keyword highlighting, sorting (Last Modified, Created Date, Title A-Z/Z-A), filter pills (All, Favorites, Pinned), and quick action context menus.
- **Right Editor Area (flex-1)**: Full-featured TipTap rich text editor with auto-save, export options, and metadata controls.
- **Mobile & Tablet Optimized**: Fluid transitions, collapsible sidebar, and single-column pane navigation.

### 2. ✍️ Rich Text & Markdown Editor
- Powered by **TipTap 3**
- **Markdown Shortcuts**: `#` for H1, `##` for H2, `-` for bullet list, `[]` for checklist, `>` for blockquote, ` ``` ` for code blocks.
- **Interactive Checklists**: Check and uncheck tasks directly in the editor.
- **Media & Links**: Insert images via URL or local file upload (converted to persistent DataURL), insert and edit hyperlinks.
- **Auto-Save Engine**: 500ms debounce with visual feedback (`Saving...` spinner and `Saved` checkmark with timestamp). Changes are instantly flushed when switching notes or closing.
- **Export Formats**:
  - 📤 Export as Markdown (`.md`)
  - 📄 Export as HTML (`.html`)
  - 💾 Export as JSON (`.json`)
  - 🖨️ Print / Save as PDF (with dedicated `@media print` clean stylesheet)

### 3. 🎨 Color Scheme & Aesthetics
- **Light Mode**:
  - Background: `#F8F9FB`
  - Sidebar: `#FFFFFF`
  - Primary: `#6366F1`
  - Text: `#202124`
  - Secondary Text: `#8A8F98`
  - Border: `#E8EAF0`
- **Dark Mode**:
  - Background: `#15171C`
  - Sidebar: `#1C1F26`
  - Primary: `#818CF8`
  - Text: `#F3F4F6`
  - Secondary Text: `#9CA3AF`
  - Border: `#282C37`

### 4. 🗂️ Categories & Tags System
- **Categories**: Personal, Work, Study, Ideas, Projects (add, edit, delete, custom color picker, live note counts).
- **Tags**: Multiple tags per note with colored badges, click-to-filter, and tag cloud.

### 5. ⚡ Command Palette (`Ctrl + K` / `Cmd + K`)
- Instant search across all notes, categories, tags, and commands.
- Quick actions: Create Note, Toggle Dark Mode, View Favorites, View Trash, Open Settings.
- Full keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).

### 6. 📊 Dashboard View
- Greeting banner with date and quick action buttons.
- Real-time statistics: Total Notes, Favorites, Categories, Recently Edited.
- 5 most recently edited notes with one-click access.
- Starred favorites quick list.

### 7. 💾 Local-First Storage & Data Freedom
- Built with **Dexie.js** over browser **IndexedDB**.
- **Full Database Backup**: One-click JSON backup export and restore.
- Sample data reset or complete database clear.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/lumina-notes.git
cd lumina-notes

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` to explore the app.

---

## 📦 Building for Production

```bash
npm run build
```

The production output is placed in the `dist` folder.

---

## 🌐 Deploying to GitHub Pages

This repository includes a ready-to-run GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Steps:
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository settings:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Once the push completes, GitHub Actions will automatically build and publish your site at:
   `https://<your-username>.github.io/<repo-name>/`

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Editor**: TipTap 3 (StarterKit, Underline, Link, Image, TaskList, TaskItem, Placeholder)
- **Database**: IndexedDB via Dexie.js
- **State Management**: Zustand 5
- **Routing**: React Router (HashRouter for foolproof static hosting)
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions (`deploy-pages`)
