import { Link } from "react-router-dom";

export default function History({ tasks, darkMode, setDarkMode }) {
  const tasksWithSessions = tasks.filter(
    (t) => t.sessions && t.sessions.length > 0
  );

  function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Focus<span className="text-amber-500">History</span>
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium tracking-wide uppercase">
            Your past sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
          >
            ← Home
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-base"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Empty state */}
      {tasksWithSessions.length === 0 ? (
        <div className="text-center py-24 text-zinc-400 dark:text-zinc-600">
          <p className="text-5xl mb-4">🍅</p>
          <p className="font-medium text-sm">No sessions yet. Start focusing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasksWithSessions.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm"
            >
              {/* Task header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.done
                      ? "bg-amber-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                />
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex-1">
                  {task.title}
                </h3>
                <span className="text-xs bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-semibold font-mono">
                  {task.sessions.length} sessions
                </span>
              </div>

              {/* Sessions list */}
              <div className="space-y-1.5">
                {task.sessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2.5 text-sm"
                  >
                    <span className="font-mono font-bold text-amber-500 w-10 flex-shrink-0">
                      {session.minutes}m
                    </span>
                    <span className="flex-1 text-zinc-500 dark:text-zinc-400 truncate">
                      {session.reason || "Focus session"}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                      {formatDate(session.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
