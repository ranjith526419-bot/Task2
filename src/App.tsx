import { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, FilterStatus, SortOption, Category, Priority } from './types';
import { loadTasksFromStorage, saveTasksToStorage, INITIAL_TASKS } from './utils/storage';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');

  // For Undo support
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage automatically on state change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Trigger celebration confetti when all tasks completed
  const prevActiveRef = useRef<number>(-1);
  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  useEffect(() => {
    if (prevActiveRef.current > 0 && activeCount === 0 && tasks.length > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
    prevActiveRef.current = activeCount;
  }, [activeCount, tasks.length]);

  const showToast = (msg: string, undoableTask?: Task) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    if (undoableTask) {
      setLastDeletedTask(undoableTask);
    } else {
      setLastDeletedTask(null);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setLastDeletedTask(null);
    }, 4500);
  };

  // CRUD Actions
  const handleAddTask = (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      priority: taskData.priority,
      category: taskData.category,
      dueDate: taskData.dueDate,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Added "${newTask.title}"`);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Task updated');
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted "${taskToDelete.title}"`, taskToDelete);
  };

  const handleUndoDelete = () => {
    if (lastDeletedTask) {
      setTasks((prev) => [lastDeletedTask, ...prev]);
      setLastDeletedTask(null);
      setToastMessage(null);
    }
  };

  const handleClearCompleted = () => {
    const count = completedCount;
    if (count === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(`Cleared ${count} completed task${count === 1 ? '' : 's'}`);
  };

  const handleToggleAll = () => {
    const allCompleted = activeCount === 0 && tasks.length > 0;
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        completed: !allCompleted,
        completedAt: !allCompleted ? Date.now() : undefined,
      }))
    );
    showToast(allCompleted ? 'Marked all tasks active' : 'Marked all tasks completed');
  };

  const handleResetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    showToast('Reset list to sample tasks');
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setSortBy('created_desc');
  };

  // Filter & Sort Logic
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Status Filter
    if (statusFilter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // 3. Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // 4. Priority Filter
    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // 5. Sorting
    const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return b.createdAt - a.createdAt;
        case 'created_asc':
          return a.createdAt - b.createdAt;
        case 'due_date':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'priority':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, statusFilter, searchQuery, categoryFilter, priorityFilter, sortBy]);

  const hasActiveFilters =
    statusFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    categoryFilter !== 'All' ||
    priorityFilter !== 'All' ||
    sortBy !== 'created_desc';

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 antialiased">
      <main className="max-w-3xl mx-auto space-y-5">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                To-Do List
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {todayFormatted} • State-driven task management with local persistence
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="reset-sample-data-btn"
              onClick={handleResetToDefaults}
              title="Reset sample tasks"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Samples</span>
            </button>
          </div>
        </header>

        {/* Add Task Input Card */}
        <section aria-labelledby="add-task-heading">
          <h2 id="add-task-heading" className="sr-only">Add a new task</h2>
          <TaskInput onAddTask={handleAddTask} />
        </section>

        {/* Task Stats Card */}
        {tasks.length > 0 && (
          <section aria-labelledby="task-stats-heading">
            <h2 id="task-stats-heading" className="sr-only">Task Statistics</h2>
            <TaskStats
              totalCount={tasks.length}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
              onToggleAll={handleToggleAll}
              allCompleted={activeCount === 0 && tasks.length > 0}
            />
          </section>
        )}

        {/* Filter & Sorting Controls */}
        <section aria-labelledby="task-filters-heading">
          <h2 id="task-filters-heading" className="sr-only">Task Filters</h2>
          <TaskFilters
            status={statusFilter}
            onStatusChange={setStatusFilter}
            counts={{
              all: tasks.length,
              active: activeCount,
              completed: completedCount,
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
            selectedPriority={priorityFilter}
            onPriorityChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </section>

        {/* Task Items List */}
        <section aria-labelledby="task-list-heading" className="space-y-2.5">
          <h2 id="task-list-heading" className="sr-only">Task List</h2>
          {filteredAndSortedTasks.length > 0 ? (
            <div id="task-items-container" className="space-y-2.5">
              {filteredAndSortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              filterStatus={statusFilter}
              isSearching={Boolean(searchQuery.trim() || categoryFilter !== 'All' || priorityFilter !== 'All')}
              hasTasks={tasks.length > 0}
              onResetFilters={handleResetFilters}
            />
          )}
        </section>

        {/* Footer info */}
        <footer className="pt-4 text-center text-xs text-slate-400">
          <p className="flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Double-click any task to quickly edit in place • Auto-persisted to LocalStorage</span>
          </p>
        </footer>
      </main>

      {/* Undo / Action Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onUndo={lastDeletedTask ? handleUndoDelete : undefined}
          onClose={() => {
            setToastMessage(null);
            setLastDeletedTask(null);
          }}
        />
      )}
    </div>
  );
}
