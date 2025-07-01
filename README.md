# 🌿 SoulSync – Offline Journaling & Mood Tracker

**SoulSync** is a warm, empathic journaling and mood tracking web app — built with **Vite + React + TypeScript + TailwindCSS + Framer Motion**.  
It’s fully **offline-first** — no accounts, no backend, just you and your thoughts.
(PWA Work in Progress)

## ✨ Features

- 📝 **Daily Journaling**
  - Write your thoughts, reflections, or progress
  - Optional daily writing prompts
  - Auto-saved to your browser with `localStorage`

- 🎭 **Mood Tracking**
  - Simple mood selector (emoji or slider)
  - Tag moods with categories (e.g. Work, Health, Social)
  - Track how you feel over time

- 📊 **Beautiful Insights**
  - Mood trend graphs and charts powered by Framer Motion
  - Weekly streak counter and mood averages
  - Gentle summaries: “You journaled 4 days in a row!”

- 💾 **Offline-First with JSON Export**
  - All data stored in `localStorage`
  - Export/Import your data as JSON to back it up
  - No sign-in or cloud storage — private and secure

- 🌈 **Soft, Inviting UI**
  - Responsive, minimal layout with lots of breathing room
  - Uses soft Google Fonts like `Quicksand` or `Nunito`
  - Empathic and affirming language throughout the app
  - Light & dark mode toggle

## 🛠️ Tech Stack

- ⚡ [Vite](https://vitejs.dev/) – fast development tooling
- ⚛️ [React](https://react.dev/)
- ⛑️ [TypeScript](https://www.typescriptlang.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🎞️ [Framer Motion](https://www.framer.com/motion/) – for smooth animations
- 💽 `localStorage` – no backend required

## 🧪 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/soulsync.git
   cd soulsync
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

4. Open in your browser:

   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Main page views (Journal, Mood, Dashboard)
├── hooks/           # Custom React hooks
├── utils/           # Helper functions (localStorage utils, date utils, etc.)
├── data/            # Static prompts or config
├── assets/          # Icons, illustrations, etc.
├── App.tsx
└── main.tsx
```

## 🚧 Upcoming Features

* 🧠 **CBT tools (Cognitive Behavioral Therapy)** – structured self-guided reflection forms *(coming soon)*
* 📅 **Calendar view**
* 🔔 Mood + journal entry reminders (optional)

## 📃 License

MIT — feel free to use and modify with attribution.

---

> 💬 *“SoulSync is a reminder that progress isn’t always loud — sometimes it’s quiet, thoughtful, and completely your own.”*

---
