import React from 'react';
import { CheckCircle2, Trash2, CheckCheck } from 'lucide-react';

interface TaskStatsProps {
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
  onToggleAll: () => void;
  allCompleted: boolean;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  totalCount,
  activeCount,
  completedCount,
  onClearCompleted,
  onToggleAll,
  allCompleted,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      id="task-stats-card"
      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="text-sm font-bold text-slate-800">
              {activeCount === 0 && totalCount > 0
                ? 'All tasks completed!'
                : `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {completedCount} of {totalCount} completed ({percentage}%)
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <button
              type="button"
              id="toggle-all-tasks-btn"
              onClick={onToggleAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{allCompleted ? 'Mark all active' : 'Complete all'}</span>
            </button>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              id="clear-completed-btn"
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear completed ({completedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          id="task-progress-fill"
          className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
