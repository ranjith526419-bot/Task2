import React from 'react';
import { CheckCircle2, ListTodo, SearchX } from 'lucide-react';
import { FilterStatus } from '../types';

interface EmptyStateProps {
  filterStatus: FilterStatus;
  isSearching: boolean;
  hasTasks: boolean;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filterStatus,
  isSearching,
  hasTasks,
  onResetFilters,
}) => {
  if (isSearching) {
    return (
      <div
        id="empty-search-state"
        className="py-12 px-4 text-center rounded-xl bg-white border border-slate-200/80"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">No matching tasks</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
          No tasks found matching your current filter criteria.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            Clear Filters & Search
          </button>
        )}
      </div>
    );
  }

  if (!hasTasks) {
    return (
      <div
        id="empty-tasks-state"
        className="py-12 px-4 text-center rounded-xl bg-white border border-slate-200/80"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ListTodo className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">Your list is clear</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Add your first task above to start organizing your workflow.
        </p>
      </div>
    );
  }

  if (filterStatus === 'active') {
    return (
      <div
        id="empty-active-state"
        className="py-12 px-4 text-center rounded-xl bg-white border border-slate-200/80"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">All caught up!</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          There are no pending active tasks on your list.
        </p>
      </div>
    );
  }

  if (filterStatus === 'completed') {
    return (
      <div
        id="empty-completed-state"
        className="py-12 px-4 text-center rounded-xl bg-white border border-slate-200/80"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ListTodo className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">No completed tasks yet</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Check off tasks as you finish them to track your accomplishments.
        </p>
      </div>
    );
  }

  return null;
};
