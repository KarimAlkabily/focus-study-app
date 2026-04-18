import { useState } from "react";

export default function TaskInput({ onAdd }) {
  const [value, setValue] = useState("");

  function handleClick() {
    if (!value.trim()) {
      alert("Enter valid task");
      return;
    }
    onAdd(value.trim());
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleClick();
  }

  return (
    <div className="flex gap-2 mb-5">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 transition-all"
      />
      <button
        onClick={handleClick}
        className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors shadow-sm shadow-amber-500/20"
      >
        Add
      </button>
    </div>
  );
}
