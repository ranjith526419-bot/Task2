import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Priority } from '../types';

interface TaskInputProps {
  onAddTask: (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => void;
}

const CATEGORIES: Category[] = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Learning'];

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('General');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('General');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <form
      id="add-task-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs transition-all duration-200 hover:border-slate-300 overflow-hidden"
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <input
            id="new-task-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task... (e.g. Finish report by 5 PM)"
            className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 text-base font-medium focus:outline-hidden px-1"
          />
          <button
            type="button"
            id="toggle-task-details-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title={isExpanded ? 'Hide details' : 'Show details'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            type="submit"
            id="submit-new-task-btn"
            disabled={!title.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
            <div>
              <input
                id="new-task-desc-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or description..."
                className="w-full text-xs text-slate-600 placeholder:text-slate-400 bg-slate-50/70 rounded-lg px-3 py-2 border border-slate-200/80 focus:border-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Priority Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Priority:
                </span>
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200/80">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      id={`priority-select-${p}`}
                      onClick={() => setPriority(p)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all cursor-pointer ${
                        priority === p
                          ? p === 'high'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : p === 'medium'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Category:
                </span>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="bg-slate-50 text-slate-700 rounded-lg px-2.5 py-1 text-xs border border-slate-200/80 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date Selector */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Due Date:
                </span>
                <input
                  id="due-date-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-50 text-slate-700 rounded-lg px-2 py-1 text-xs border border-slate-200/80 focus:border-slate-400 focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
