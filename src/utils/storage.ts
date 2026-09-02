import { Task } from '../types';

const STORAGE_KEY = 'todo_app_tasks_v2';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review quarterly architecture plan',
    description: 'Check component modularity and client-side performance metrics',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'task-2',
    title: 'Pick up groceries for dinner',
    description: 'Fresh vegetables, sourdough bread, olive oil',
    completed: false,
    priority: 'medium',
    category: 'Shopping',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'task-3',
    title: 'Complete 30-minute cardio session',
    description: 'Morning run or high intensity interval circuit',
    completed: true,
    priority: 'low',
    category: 'Health',
    createdAt: Date.now() - 3600000 * 12,
    completedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'task-4',
    title: 'Read chapter 4 of TypeScript Deep Dive',
    description: 'Advanced generic type constraints and narrowing',
    completed: false,
    priority: 'medium',
    category: 'Learning',
    createdAt: Date.now() - 3600000 * 24,
  },
];

export function loadTasksFromStorage(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // First visit: Seed initial tasks and persist
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return INITIAL_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
    return false;
  }
}
