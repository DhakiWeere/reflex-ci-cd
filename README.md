# Reflex CI/CD
### Self Reacting System
**Reflex CI/CD** is a bidirectional CI/CD demonstration project designed to showcase full automation between a GitHub repository and an AWS EC2-hosted web app.  
It not only deploys automatically on each push — it also lets you edit and commit code *back* to the GitHub repo directly from the running web interface.

---

## Features

- **Automatic Deployment via GitHub Actions**  
  Every new commit triggers a GitHub Actions workflow that connects to your EC2 instance, pulls the latest changes, and rebuilds the app.

- **Web-Based Code Editor**  
  The hosted app includes a live HTML editor that displays the current code from the GitHub repo.

- **Reverse Sync to GitHub**  
  Edits made in the web app can be committed back to the repository using the GitHub API, creating a continuous feedback loop.

- **Simple, Lightweight Stack**  
  Built using Node.js (Express) + a minimal frontend editor (Monaco or CodeMirror). Deployed on an EC2 instance using SSH.

---

## Concept Overview

LoopDeploy demonstrates a *two-way CI/CD pipeline*:

```text
┌──────────┐        ┌──────────────┐        ┌──────────┐
│  GitHub  │ ─push→ │  EC2 Server  │ ─view→ │  Web App │
│  Repo    │ ←commit│ (Host + App) │ ←edit─ │  Editor  │
└──────────┘        └──────────────┘        └──────────┘
