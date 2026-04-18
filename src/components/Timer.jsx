import { useEffect, useRef, useState } from "react";

// ✅ FIX 3: Helper to load/save timer state from localStorage
const STORAGE_KEY = "timerState";

function loadTimerState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function Timer({ activeTask, onToggle, onAddSession }) {
  // ✅ FIX 3: Restore timer state from localStorage on mount
  const [minutes, setMinutes] = useState(() => {
    const s = loadTimerState();
    return s?.minutes ?? "";
  });
  const [seconds, setSeconds] = useState(() => {
    const s = loadTimerState();
    return s?.seconds ?? 0;
  });
  // ✅ Always start paused after refresh/navigation (user must manually resume)
  const [isRunning, setIsRunning] = useState(false);
  const [showNewInput, setShowNewInput] = useState(false);
  const [newMinutes, setNewMinutes] = useState("");
  const [reason, setReason] = useState("");

  // ✅ FIX 1: Use a state flag to signal timer completion (not inside state updater)
  const [timerDone, setTimerDone] = useState(false);

  // ✅ FIX 1: Refs so the completion effect always reads fresh values
  const activeTaskRef = useRef(activeTask);
  const minutesRef = useRef(minutes);

  useEffect(() => {
    activeTaskRef.current = activeTask;
  }, [activeTask]);

  useEffect(() => {
    minutesRef.current = minutes;
  }, [minutes]);

  // ✅ FIX 3: Persist timer state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ minutes, seconds })
    );
  }, [minutes, seconds]);

  // ✅ FIX 3: Clear localStorage when timer is reset/done
  function clearTimerStorage() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ================== Logic ==================

  function handlestart() {
    if (!minutes || Number(minutes) <= 0) return;
    if (!activeTask) {
      alert("Please select a task first");
      return;
    }
    setSeconds(Number(minutes) * 60);
    setIsRunning(true);
  }

  function handleNewStart() {
    if (!newMinutes || Number(newMinutes) <= 0) return;
    onAddSession(activeTask, Number(newMinutes), reason);
    setSeconds(Number(newMinutes) * 60);
    setMinutes(newMinutes);
    setIsRunning(true);
    setShowNewInput(false);
    setReason("");
    setNewMinutes("");
  }

  function togglePause() {
    setIsRunning((prev) => !prev);
  }

  function reset() {
    setIsRunning(false);
    setSeconds(0);
    setShowNewInput(false);
    clearTimerStorage();
  }

  // ✅ FIX 1: Clean countdown — NO side effects inside state updater
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // Just set flag — don't call confirm/onToggle/onAddSession here
          setIsRunning(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // ✅ FIX 1: Handle completion in a dedicated effect — reads fresh refs
  useEffect(() => {
    if (!timerDone) return;
    setTimerDone(false);
    clearTimerStorage();

    const done = window.confirm("Did you finish the task?");
    if (done) {
      onToggle(activeTaskRef.current);
      onAddSession(activeTaskRef.current, Number(minutesRef.current), "");
    } else {
      setShowNewInput(true);
    }
  }, [timerDone, onToggle, onAddSession]);

  // ================== UI ==================

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalSeconds = Number(minutes) * 60 || 1;
  const progress =
    seconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0;

  // ✅ FIX 3: Show "Paused — resume?" banner if there's a saved timer on mount
  const hasPausedTimer = seconds > 0 && !isRunning;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mt-2 shadow-sm">
      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-5">
        Focus Timer
      </p>

      {/* ✅ FIX 3: Paused banner shown after refresh/navigation */}
      {hasPausedTimer && (
        <div className="mb-4 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center justify-between">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            ⏸ Timer paused — resume?
          </p>
          <button
            onClick={() => setIsRunning(true)}
            className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 px-3 py-1 rounded-lg transition-colors"
          >
            Resume
          </button>
        </div>
      )}

      {/* Timer display */}
      <div className="text-center mb-6">
        <div
          className={`font-mono text-8xl font-bold tracking-tight transition-colors duration-500 ${
            isRunning
              ? "text-amber-500 dark:text-amber-400"
              : seconds > 0
              ? "text-zinc-700 dark:text-zinc-300"
              : "text-zinc-200 dark:text-zinc-800"
          }`}
        >
          {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
        </div>

        {/* Progress bar */}
        {seconds > 0 && (
          <div className="mt-5 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Start input — shown only when idle */}
      {!isRunning && seconds === 0 && (
        <div className="flex gap-2 mb-3 w-full overflow-hidden">
          <input
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            type="number"
            placeholder="Minutes..."
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <button
            disabled={!activeTask || !minutes}
            onClick={handlestart}
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {/* Pause / Reset controls */}
      {seconds > 0 && (
        <div className="flex gap-2">
          <button
            onClick={togglePause}
            className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {isRunning ? "Pause" : "Resume"}
          </button>
          <button
            onClick={reset}
            className="px-5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-950/40 text-zinc-400 hover:text-red-500 font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Extra session panel */}
      {showNewInput && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Need more time? 🔥
          </p>
          <input
            value={newMinutes}
            onChange={(e) => setNewMinutes(e.target.value)}
            type="number"
            placeholder="Extra minutes..."
            className="w-full bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/60 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why extra session? (optional)"
            className="w-full bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/60 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <button
            onClick={handleNewStart}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Start Extra Session
          </button>
        </div>
      )}

      {/* Hint when no task selected */}
      {!activeTask && (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-4">
          ↑ Select a task above to start focusing
        </p>
      )}
    </div>
  );
}
