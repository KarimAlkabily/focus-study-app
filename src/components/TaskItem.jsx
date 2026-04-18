export default function TaskItem({
  task,
  onDelete,
  onToggle,
  onActiveTaskId,
  isActive,
}) {
  return (
    <div
      className={`group flex items-center gap-3 bg-white dark:bg-zinc-900 border rounded-xl px-4 py-3 mb-2 transition-all duration-200 ${
        isActive
          ? "border-amber-400 dark:border-amber-500 shadow-sm shadow-amber-400/20"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {/* Toggle done button */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          task.done
            ? "bg-amber-500 border-amber-500"
            : "border-zinc-300 dark:border-zinc-600 hover:border-amber-400 dark:hover:border-amber-500"
        }`}
      >
        {task.done && (
          <span className="text-white text-xs leading-none">✓</span>
        )}
      </button>

      {/* Task title */}
      <span
        className={`flex-1 text-sm font-medium transition-all ${
          task.done
            ? "line-through text-zinc-400 dark:text-zinc-600"
            : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {task.title}
      </span>

      {/* Sessions badge */}
      {task.sessionsDone > 0 && (
        <span className="text-xs bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold font-mono">
          🍅 {task.sessionsDone}
        </span>
      )}

      {/* Action buttons — visible on hover */}
      <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onActiveTaskId(task.id)}
          className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
            isActive
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400"
          }`}
        >
          {isActive ? "Active" : "Focus"}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
