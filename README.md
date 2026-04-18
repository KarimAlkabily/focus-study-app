# 🚀 Focus Study App

A productivity web app built with React + Vite to help users stay focused, track study sessions, and manage tasks efficiently.

---

## 📌 Overview

Focus Study App is designed to combine **task management + focus timer (Pomodoro-style)** in one simple interface.

Users can:

* Create and manage tasks
* Track focus sessions
* Add extra sessions with reasons
* View history and statistics
* Stay organized and productive

---

## ✨ Features

### 📝 Task Management

* Add new tasks
* Delete tasks
* Mark tasks as completed
* Select active task

---

### ⏱️ Focus Timer

* Custom timer (user-defined minutes)
* Start / Pause / Resume / Reset
* Works only when a task is selected
* Prevents invalid inputs

---

### 🔁 Session System

* Automatically logs sessions when timer ends
* Add extra sessions manually
* Attach a **reason** for extra sessions
* Tracks total sessions per task

---

### 📊 Statistics

* Total tasks
* Completed tasks
* Total sessions
* Daily sessions tracking
* Daily completed tasks

---

### 📜 History Page

* Shows all sessions per task
* Displays:

  * Time spent
  * Reason (if exists)
  * Organized per task

---

### 🌙 Dark Mode

* Toggle between light and dark themes
* Uses Tailwind CSS dark mode

---

### 💾 Local Storage

* Saves all data locally:

  * Tasks
  * Sessions
  * Stats
* Data persists after refresh

---

### 🌐 Routing

* Multi-page app using React Router
* Pages:

  * Home
  * History

---

## 🛠️ Tech Stack

* React
* Vite
* JavaScript (ES6+)
* Tailwind CSS
* React Router

---

## 📦 Installation

```bash
git clone https://github.com/your-username/focus-study-app.git
cd focus-study-app
npm install
npm run dev
```

---

## 🚀 Live Demo

👉 https://your-vercel-link.vercel.app

---

## 📁 Project Structure

```bash
src/
 ├── components/
 │   ├── TaskInput.jsx
 │   ├── TaskList.jsx
 │   ├── TaskItem.jsx
 │   ├── Timer.jsx
 │   └── History.jsx
 ├── App.jsx
 └── main.jsx
```

---

## 🎯 Future Improvements

* Real-time timer persistence (even after closing tab)
* Charts for statistics (daily/weekly)
* Notifications & sound alerts
* Focus mode (full screen)
* User authentication
* Cloud database (Firebase / Supabase)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Developed by **[Karim-Alkabily]**

If you like this project, consider giving it a ⭐ on GitHub!
