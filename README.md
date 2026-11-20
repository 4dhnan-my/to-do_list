# Tempo AI Planner

Tempo is a browser-based task and weekly-planning application built with React and Vite. It combines task management, a calendar, reminders and productivity summaries, with task data stored in the browser.

## Features

- Create, edit, complete, search and filter tasks
- Task categories, tags, priorities, due dates, times, subtasks and notes
- Rule-based natural-language date/time parsing and priority suggestions
- Dashboard, task list, weekly calendar, analytics, reminders and settings views
- Repeat rules, browser notifications, reminder snoozing and optional vibration/sound
- Light/dark/system theme settings
- Local browser storage, JSON export/import and a service-worker-based offline shell

> Task parsing and suggestions are implemented with local JavaScript rules in `src/utils/ai.js`; this repository does not show a connected external AI model or cloud-synced account service. Task data is stored in the browser and is not automatically shared across devices.

## Tech stack

- React 19
- Vite 6
- Tailwind CSS 3 and PostCSS
- Framer Motion
- Lucide React
- Browser APIs including Local Storage, Notifications and the Service Worker API

## Run locally

Install Node.js (the project was developed with a Vite/Node toolchain), then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (configured for `http://127.0.0.1:5173`).

## Production build

```bash
npm run build
npm run preview
```

Run the linter with:

```bash
npm run lint
```

## Project structure

```text
.
├── public/             # App icon, manifest and service worker
├── src/
│   ├── components/     # Reusable UI components
│   ├── data/           # Sample tasks and default settings
│   ├── hooks/          # Local storage and reminder hooks
│   ├── pages/          # Dashboard, tasks, calendar, analytics, reminders, settings
│   ├── utils/          # Date helpers and local task parsing/suggestions
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Notes

- Grant notification permission in the browser if you want system notifications.
- Browser storage can be cleared by the user or browser; export important task data regularly.
- Do not store sensitive personal or business information in this client-side demo.
