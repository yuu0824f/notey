---
name: notey
description: >-
  Develop, maintain, test, and deploy Notey (Lumina Notes) — a premium personal notebook web app built with React, TypeScript, Vite, Tailwind CSS, TipTap, and Dexie IndexedDB.
---

# Notey (Lumina Notes) Skill Guide

This skill provides step-by-step procedures and references for developing, extending, testing, and deploying the **Notey** personal notebook application.

## 1. Project Overview

- **Repository**: [https://github.com/yuu0824f/notey](https://github.com/yuu0824f/notey)
- **Tech Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, TipTap 3, Dexie.js (IndexedDB), Zustand 5, Lucide React Icons.
- **Architecture**:
  - `src/db/`: IndexedDB database schema and migration layer (`LuminaNotesDB`).
  - `src/store/`: Zustand reactive state store (`useNoteStore.ts`).
  - `src/components/layout/`: Three-column layout (`Sidebar.tsx`, `MainLayout.tsx`).
  - `src/components/notes/`: Notes list, filtering, and search highlighting (`NotesList.tsx`, `NoteCard.tsx`).
  - `src/components/editor/`: TipTap rich text & markdown editor (`RichTextEditor.tsx`, `EditorToolbar.tsx`, `EditorHeader.tsx`).
  - `src/components/dashboard/`: Welcome screen, stats cards, and quick access (`Dashboard.tsx`).
  - `src/components/command-palette/`: Global `Ctrl+K` modal (`CommandPalette.tsx`).
  - `src/components/modals/`: Modals for categories, tags, settings, images, and links.

---

## 2. Development Workflows

### Starting Local Dev Server
```bash
npm run dev
```

### Type Checking & Production Build
```bash
npm run build
```
The output will be bundled into the `dist/` folder.

---

## 3. Git & GitHub Deployment Workflow

The repository is configured to auto-deploy to GitHub Pages via GitHub Actions:
- **Workflow File**: `.github/workflows/deploy.yml`
- **Trigger**: Push to branch `main`
- **Output URL**: `https://yuu0824f.github.io/notey/`

### Committing and Pushing Changes
```bash
git add .
git commit -m "feat: your description"
git push -u origin main
```

---

## 4. Key Architectural Patterns

1. **Local-First Persistence**:
   - All note records are stored in IndexedDB using Dexie.js.
   - Any state change in the UI should update Zustand and sync to `db.notes`.
2. **Auto-Save Debounce**:
   - Editor changes trigger debounced saves (500ms) to prevent UI stutter.
   - Changing note selection or unmounting flushes pending saves synchronously.
3. **Responsive Three-Column Layout**:
   - Desktop displays all three columns (`Sidebar`, `NotesList`, `RichTextEditor`).
   - Tablet collapses sidebar into compact rail.
   - Mobile shows single-pane navigation using `mobilePane` state (`sidebar`, `list`, `editor`).
