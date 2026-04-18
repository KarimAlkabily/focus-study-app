import { useState, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import History from "./components/History";

function App() {
  const [activeTask, setActiveTask] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // ================== Logic (unchanged) ==================

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      done: false,
      sessionsDone: 0,
      sessions: [],
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (activeTask === id) setActiveTask(null);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function addSession(id, minutes, reason) {
    // ✅ FIX: use functional update so it never reads stale tasks
    // (previously, calling toggleTask then addSession would override the toggle)
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              sessionsDone: task.sessionsDone + 1,
              sessions: [
                ...task.sessions,
                {
                  minutes: minutes,
                  reason: reason,
                  date: new Date().toISOString(),
                },
              ],
            }
          : task
      )
    );
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    // ✅ FIX: apply dark class to <html> so ALL dark: variants work globally
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function isToday(dateString) {
    const d = new Date(dateString);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const totalSessions = tasks.reduce(
    (sum, task) => sum + (task.sessionsDone || 0),
    0
  );
  const todaySessions = tasks.reduce((sum, task) => {
    const count = (task.sessions || []).filter((s) => isToday(s.date)).length;
    return sum + count;
  }, 0);
  const todayCompletedTasks = tasks.filter((task) => {
    if (!task.done) return false;
    return (task.sessions || []).some((s) => isToday(s.date));
  }).length;

  // ================== UI ==================

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <Routes>
          <Route
            path="/"
            element={
              <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      Focus
                      <span className="text-amber-500">Study</span>
                    </h1>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium tracking-wide uppercase">
                      Stay locked in
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/history"
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
                    >
                      History →
                    </Link>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-base"
                      title="Toggle theme"
                    >
                      {darkMode ? "☀️" : "🌙"}
                    </button>
                  </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Total Tasks", value: totalTasks, icon: "📋" },
                    { label: "Completed", value: completedTasks, icon: "✅" },
                    { label: "All Sessions", value: totalSessions, icon: "🍅" },
                    { label: "Today Sessions", value: todaySessions, icon: "⚡" },
                  ].map(({ label, value, icon }) => (
                    <div
                      key={label}
                      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                      <p className="text-xl font-bold text-amber-500 font-mono">{value}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{icon} {label}</p>
                    </div>
                  ))}
                </div>

                {/* Today Banner */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl px-5 py-4 mb-6 flex gap-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">
                      Sessions Today
                    </p>
                    <p className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
                      {todaySessions}
                    </p>
                  </div>
                  <div className="w-px bg-amber-200 dark:bg-amber-900/60" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">
                      Done Today
                    </p>
                    <p className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
                      {todayCompletedTasks}
                    </p>
                  </div>
                </div>

                {/* Task Input */}
                <TaskInput onAdd={addTask} />

                {/* Task List */}
                <TaskList
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleTask}
                  onActiveTaskId={setActiveTask}
                  activeTaskId={activeTask}
                />

                {/* Timer */}
                <Timer
                  activeTask={activeTask}
                  onToggle={toggleTask}
                  onAddSession={addSession}
                />
              </main>
            }
          />

          <Route
            path="/history"
            element={
              <History
                tasks={tasks}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
      </Routes>
    </div>
  );
}

export default App;
