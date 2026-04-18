import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onDelete,
  onToggle,
  onActiveTaskId,
  activeTaskId,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 dark:text-zinc-600 mb-4">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm font-medium">No tasks yet — add one above!</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onActiveTaskId={onActiveTaskId}
          isActive={activeTaskId === task.id}
        />
      ))}
    </div>
  );
}
