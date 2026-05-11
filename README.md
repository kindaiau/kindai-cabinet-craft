# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## How do branches work?

### What is a branch?

A **branch** is an independent copy of your code that lives alongside your main codebase. Think of it like a parallel timeline — you can make changes on a branch without touching the stable code on your `main` branch. Once the changes are reviewed and approved, the branch is **merged** back into `main`.

```
main  ──────────────────────────────────────► (stable, production-ready)
          │
          └─► my-feature-branch ── work ── work ──► merged back into main
```

### Why do AI coding agents (like GitHub Copilot / OpenClaw) create branches?

When an AI coding agent works on a task or issue in your repository, it follows the same safe workflow a human developer would:

1. **Creates a new branch** — e.g. `copilot/fix-login-bug` or `openclaw/add-dark-mode` — so that any changes are isolated from your main codebase.
2. **Makes changes on that branch** — commits code, updates files, runs tests.
3. **Opens a Pull Request (PR)** — this lets you review exactly what was changed before anything reaches `main`.
4. **You review and merge** — once you are happy with the changes, you merge the PR. If you are not happy, you can close it or request changes without any harm done to `main`.

This means your `main` branch stays clean and stable at all times. You are always in control of what gets merged.

### How to merge a branch into main

1. Go to the **Pull Requests** tab in GitHub.
2. Open the PR created by the agent.
3. Review the changes in the **Files changed** tab.
4. Click **Merge pull request** when you are satisfied.
5. Optionally, delete the branch after merging — GitHub will prompt you.

### How to delete an unwanted branch

If you want to discard a branch without merging it:

1. Go to **Code → Branches** in GitHub (or visit `github.com/<your-org>/<repo>/branches`).
2. Find the branch you want to remove.
3. Click the **trash icon** next to it.

This is completely safe — deleting a branch does not affect `main` or any other branch.

### Summary

| Term | Meaning |
|---|---|
| `main` | Your stable, production-ready branch |
| Feature branch | A temporary branch for a specific task or fix |
| Pull Request (PR) | A request to review and merge a branch into `main` |
| Merge | Combining the changes from a branch into another branch |
