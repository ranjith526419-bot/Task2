import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Tag,
  X,
  Clock,
} from 'lucide-react';
import { Task, Priority, Category } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const CATEGORIES: Category[] = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Learning'];

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;

    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Format Due Date & calculate urgency
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, status: 'overdue' };
    } else if (diffDays === 0) {
      return { text: 'Due today', status: 'today' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', status: 'tomorrow' };
    } else {
      return {
        text: target.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        status: 'upcoming',
      };
    }
  };

  const dueInfo = formatDueDate(task.dueDate);

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Med
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Low
          </span>
        );
    }
  };

  const getCategoryBadge = (cat: Category) => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
        {cat}
      </span>
    );
  };

  if (isEditing) {
    return (
      <div
        id={`task-item-edit-${task.id}`}
        className="p-4 bg-white rounded-xl border-2 border-indigo-500 shadow-sm space-y-3"
      >
        <div className="space-y-2">
          <input
            ref={titleInputRef}
            id={`task-edit-title-input-${task.id}`}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-indigo-500"
            placeholder="Task title..."
          />
          <input
            id={`task-edit-desc-input-${task.id}`}
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-indigo-500"
            placeholder="Add notes..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Priority edit */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              id={`task-edit-priority-${task.id}`}
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="bg-slate-50 text-slate-700 rounded-md px-2 py-1 border border-slate-200 text-xs focus:outline-hidden"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category edit */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              id={`task-edit-category-${task.id}`}
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as Category)}
              className="bg-slate-50 text-slate-700 rounded-md px-2 py-1 border border-slate-200 text-xs focus:outline-hidden"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Due date edit */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Due:</span>
            <input
              id={`task-edit-duedate-${task.id}`}
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="bg-slate-50 text-slate-700 rounded-md px-2 py-1 border border-slate-200 text-xs focus:outline-hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              id={`cancel-edit-btn-${task.id}`}
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              type="button"
              id={`save-edit-btn-${task.id}`}
              onClick={handleSaveEdit}
              disabled={!editTitle.trim()}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all duration-200 bg-white ${
        task.completed
          ? 'border-slate-200/70 bg-slate-50/50 opacity-80'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Custom Checkbox */}
        <button
          type="button"
          id={`toggle-task-${task.id}`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? `Mark "${task.title}" as active` : `Mark "${task.title}" as complete`}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
              : 'border-slate-300 hover:border-slate-500 bg-white hover:bg-slate-50'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Content */}
        <div
          className="flex-1 min-w-0 cursor-pointer select-text"
          onDoubleClick={handleStartEdit}
          title="Double-click to edit"
        >
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`text-sm font-semibold tracking-tight transition-all break-words ${
                task.completed
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              className={`text-xs mb-2 transition-all break-words ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges & Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {getPriorityBadge(task.priority)}
            {getCategoryBadge(task.category)}

            {dueInfo && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  task.completed
                    ? 'bg-slate-100 text-slate-400 border-slate-200'
                    : dueInfo.status === 'overdue'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : dueInfo.status === 'today'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {dueInfo.text}
              </span>
            )}

            {task.completed && task.completedAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                Done
              </span>
            )}
          </div>
        </div>

        {/* Action buttons (hover or mobile visible) */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            id={`edit-task-btn-${task.id}`}
            onClick={handleStartEdit}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id={`delete-task-btn-${task.id}`}
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
