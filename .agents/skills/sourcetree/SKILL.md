---
name: sourcetree
description: >-
  Manage Git version control, visual diffs, interactive staging, branch management, GitHub credential authentication, and remote pushing via the Atlassian SourceTree GUI client on Windows. Use this skill whenever the user asks to operate SourceTree, push changes through SourceTree, or troubleshoot GUI Git workflows.
---

# SourceTree Git Workflow Skill Guide

This skill provides procedures for integrating and executing Git workflows using **SourceTree** (Atlassian's desktop Git client) on Windows.

## 1. Quick Launch

Launch the current repository directly in SourceTree:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/sourcetree/scripts/launch-sourcetree.ps1
```

Or manually:
```powershell
Start-Process "$env:LOCALAPPDATA\SourceTree\SourceTree.exe" -ArgumentList (Get-Location).Path
```

---

## 2. Pushing Changes in SourceTree (Step-by-Step)

When terminal git prompts for credentials or two-factor authentication, SourceTree provides a native, browser-authenticated OAuth interface:

1. **Open the Repository**:
   - Ensure the repository `notey` is open in the SourceTree tab.
2. **Review Unpushed Commits**:
   - Notice the badge count on the **Push (推送)** button in the top toolbar (e.g., `Push: 1`).
   - In the left sidebar under **Branches**, ensure you are on `main`.
3. **Execute Push**:
   - Click the **Push (推送)** icon in the top toolbar.
   - In the popup dialog:
     - Check the checkbox for the `main` branch under **Local Branch**.
     - Confirm the target **Remote Branch** is `main` on `origin` (`https://github.com/yuu0824f/notey.git`).
     - Check **Track?** if not already tracked.
   - Click **Push (確定 / 推送)** at the bottom-right.
4. **GitHub Authentication (First-time)**:
   - If prompted for login credentials, select **Log in with browser (OAuth)** or enter your GitHub Personal Access Token (PAT).
   - Once authorized, SourceTree caches the credential securely in Windows Credential Manager.

---

## 3. Post-Push Verification

Once pushed to `main`, verify:
1. **GitHub Repository**: Visit [https://github.com/yuu0824f/notey](https://github.com/yuu0824f/notey)
2. **GitHub Actions**: Navigate to the **Actions** tab to watch `.github/workflows/deploy.yml` build and deploy the app.
3. **Live App**: Visit `https://yuu0824f.github.io/notey/` to view the live deployment.

---

## 4. Common Troubleshooting

- **Detached HEAD**: Run `git checkout main` before pushing.
- **Rejected Non-Fast-Forward**: In SourceTree, click **Pull** (with rebase or merge) to integrate remote changes before retrying **Push**.
- **Account Disconnect**: Go to **Tools** > **Options** > **Authentication** in SourceTree, edit the GitHub account, and refresh OAuth token.
