import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const icons = {
  grid: "⌗",
  tasks: "✓",
  focus: "◷",
  notes: "□",
  stats: "↗",
  info: "i",
  plus: "+",
  search: "⌕",
  sun: "☼",
  bell: "♧",
  more: "⋮",
  check: "✓",
  trash: "⌫",
  play: "▶",
  pause: "Ⅱ",
  reset: "↻",
  settings: "⚙",
  pin: "⚑",
};

const initialTasks = [
  { id: 1, title: "Finish DSA problem set", detail: "2 problems remaining", category: "Study", priority: "High", due: "Today", done: false },
  { id: 2, title: "Read DBMS Chapter 3", detail: "Relational Algebra", category: "Study", priority: "Low", due: "Today", done: true },
  { id: 3, title: "Build portfolio website", detail: "Add new projects", category: "Project", priority: "High", due: "Tomorrow", done: false },
  { id: 4, title: "Workout", detail: "Stay consistent", category: "Health", priority: "Medium", due: "Tomorrow", done: false },
  { id: 5, title: "Watch new anime ep", detail: "Wind Breaker S2", category: "Personal", priority: "Low", due: "This Week", done: false },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All");
  const [newTask, setNewTask] = useState("");
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [note, setNote] = useState("");
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setTimerRunning(false);
          return 25 * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && !task.done) ||
        (filter === "Completed" && task.done);

      const haystack = `${task.title} ${task.detail} ${task.category}`.toLowerCase();
      return matchesFilter && haystack.includes(query.toLowerCase());
    });
  }, [tasks, filter, query]);

  function addTask(event) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    setTasks((items) => [
      ...items,
      {
        id: Date.now(),
        title,
        detail: "New task",
        category: "Personal",
        priority: "Medium",
        due: "Today",
        done: false,
      },
    ]);
    setNewTask("");
  }

  function toggleTask(id) {
    setTasks((items) =>
      items.map((task) => task.id === id ? { ...task, done: !task.done } : task)
    );
  }

  function removeTask(id) {
    setTasks((items) => items.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((items) => items.filter((task) => !task.done));
  }

  function formatTime(total) {
    const minutes = Math.floor(total / 60).toString().padStart(2, "0");
    const secs = (total % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>N</span></div>
          <div>
            <strong>Nebula</strong>
            <small>Plan • Focus • Achieve</small>
          </div>
        </div>

        <nav className="nav">
          {[
            ["Dashboard", icons.grid],
            ["Tasks", icons.tasks],
            ["Focus", icons.focus],
            ["Notes", icons.notes],
            ["Stats", icons.stats],
            ["About", icons.info],
          ].map(([label, icon]) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "active" : ""}`}
              onClick={() => setActive(label)}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="upgrade-card">
          <div className="upgrade-orb">✦</div>
          <strong>Go Pro ✨</strong>
          <p>Unlock more themes, analytics and widgets.</p>
          <button>Learn More <span>→</span></button>
        </div>

        <div className="sidebar-footer">
          <span>Built with <b>♥</b></span>
          <span>React + Vite + Docker</span>
          <span>Frontend Only</span>
          <div className="tech-row"><i>⚛</i><i>◆</i><i>▣</i></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="search">
            <span>{icons.search}</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <button className="icon-button">{icons.sun}</button>
            <button className="icon-button bell">{icons.bell}<em /></button>
            <div className="profile">
              <div className="avatar">A</div>
              <div>
                <strong>Arnab</strong>
                <small>Productive Mode</small>
              </div>
              <span>⌄</span>
            </div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <h1>Welcome back, <span>Arnab</span> 👋</h1>
              <p>Small steps. Big results. Keep building.</p>
            </div>
            <div className="date-pill">
              <span>☼</span>
              <strong>{new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</strong>
            </div>
          </section>

          <section className="stats-grid">
            <Stat icon="▣" label="Total Tasks" value={tasks.length} sub="↑ 3 this week" tone="blue" />
            <Stat icon="ϟ" label="Focus Streak" value="7 days" sub="Personal best!" tone="orange" />
            <Stat icon="✓" label="Completed" value={completed} sub={`${progress}% done`} tone="green" />
            <Stat icon="◷" label="Focus Time" value="4.2h" sub="Today" tone="purple" />
          </section>

          <section className="dashboard-grid">
            <div className="left-column">
              <section className="panel tasks-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Your Tasks</h2>
                    <span className="muted">{pending} tasks waiting for you</span>
                  </div>
                  <button className="primary-button" onClick={() => document.getElementById("task-input")?.focus()}>
                    <span>+</span> Add Task
                  </button>
                </div>

                <div className="task-tabs">
                  {["All", "Active", "Completed"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={filter === item ? "selected" : ""}
                    >
                      {item} <b>{item === "All" ? tasks.length : item === "Active" ? pending : completed}</b>
                    </button>
                  ))}
                  <button className="clear-button" onClick={clearCompleted}>⌫ Clear Completed</button>
                </div>

                <form className="task-input" onSubmit={addTask}>
                  <input
                    id="task-input"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                  />
                  <button type="submit">Add</button>
                </form>

                <div className="task-list">
                  {visibleTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onRemove={removeTask}
                    />
                  ))}
                  {visibleTasks.length === 0 && (
                    <div className="empty-state">No tasks match your search.</div>
                  )}
                </div>
              </section>

              <section className="lower-grid">
                <ProductivityChart />
                <QuoteCard />
              </section>
            </div>

            <div className="right-column">
              <section className="weather-card">
                <div className="weather-top">
                  <span>⌖ Kolkata, India</span>
                  <span className="weather-temp">☁️ 28°C</span>
                </div>
                <div className="weather-time">{new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</div>
                <div className="weather-date">{new Date().toLocaleDateString([], {weekday: "long", day: "numeric", month: "long", year: "numeric"})}</div>
                <div className="mountains" />
              </section>

              <section className="panel timer-panel">
                <div className="panel-heading compact">
                  <h2>Focus Timer</h2>
                  <button className="select-button">Pomodoro ⌄</button>
                </div>
                <div className="timer-ring">
                  <div>
                    <span className="leaf">♨</span>
                    <strong>{formatTime(seconds)}</strong>
                    <small>Focus Time</small>
                  </div>
                </div>
                <div className="timer-controls">
                  <button onClick={() => { setTimerRunning(false); setSeconds(25 * 60); }}>{icons.reset}</button>
                  <button className="play" onClick={() => setTimerRunning((v) => !v)}>
                    {timerRunning ? icons.pause : icons.play}
                  </button>
                  <button>{icons.settings}</button>
                </div>
              </section>

              <section className="panel notes-panel">
                <div className="panel-heading compact">
                  <h2>Quick Notes</h2>
                  <button className="save-button">Save</button>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 300))}
                  placeholder="Jot down your thoughts..."
                />
                <div className="note-footer">
                  <span>{note.length} / 300</span>
                  <div><button>B</button><button><i>I</i></button><button>☷</button><button>&lt;/&gt;</button></div>
                </div>
              </section>
            </div>
          </section>

          <footer className="footer">
            <span>Made with <b>♥</b> using <strong>React</strong> & <strong>Vite</strong></span>
            <span>•</span>
            <span>Frontend-only demo</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, label, value, sub, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={tone}>{sub}</small>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onRemove }) {
  return (
    <div className={`task-row ${task.done ? "done" : ""}`}>
      <button className={`checkbox ${task.done ? "checked" : ""}`} onClick={() => onToggle(task.id)}>
        {task.done ? "✓" : ""}
      </button>
      <div className="task-copy">
        <strong>{task.title}</strong>
        <span>{task.detail}</span>
      </div>
      <span className={`category ${task.category.toLowerCase()}`}>{task.category}</span>
      <span className={`priority ${task.priority.toLowerCase()}`}>⚑ {task.priority}</span>
      <span className="due">◷ {task.due}</span>
      <button className="more">{icons.more}</button>
      <button className="delete" onClick={() => onRemove(task.id)}>{icons.trash}</button>
    </div>
  );
}

function ProductivityChart() {
  return (
    <section className="panel chart-panel">
      <div className="panel-heading compact">
        <h2>Productivity Overview</h2>
        <button className="select-button">This Week ⌄</button>
      </div>
      <div className="chart">
        <div className="chart-grid">
          {[0,1,2,3].map((x) => <span key={x} />)}
        </div>
        <svg viewBox="0 0 700 190" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line" x1="0" x2="1">
              <stop offset="0%" stopColor="#9d4edd"/>
              <stop offset="100%" stopColor="#27d8ff"/>
            </linearGradient>
            <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3cff" stopOpacity=".28"/>
              <stop offset="100%" stopColor="#7c3cff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0 140 C70 145 90 150 140 120 S220 55 280 95 S360 130 420 105 S500 120 560 80 S630 65 700 25 L700 190 L0 190Z" fill="url(#fill)" />
          <path d="M0 140 C70 145 90 150 140 120 S220 55 280 95 S360 130 420 105 S500 120 560 80 S630 65 700 25" fill="none" stroke="url(#line)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="700" cy="25" r="6" fill="#9d4edd" />
        </svg>
        <div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      </div>
    </section>
  );
}

function QuoteCard() {
  return (
    <section className="quote-card">
      <div className="quote-copy">
        <span className="quote-mark">“</span>
        <p>Discipline is choosing between what you want now and what you want most.</p>
        <small>— Abraham Lincoln</small>
      </div>
      <div className="city-art">
        <span>✦</span><span>✧</span><span>☄</span>
        <div className="moon" />
        <div className="city-line" />
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);