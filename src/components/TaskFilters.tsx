import React from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { FilterStatus, SortOption, Category, Priority } from '../types';

interface TaskFiltersProps {
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
  selectedPriority: Priority | 'All';
  onPriorityChange: (priority: Priority | 'All') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: (Category | 'All')[] = ['All', 'General', 'Work', 'Personal', 'Shopping', 'Health', 'Learning'];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  onStatusChange,
  counts,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-xs">
      {/* Top row: Status filter tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status segment pills */}
        <div
          id="status-filter-group"
          className="inline-flex bg-slate-100/90 p-1 rounded-lg border border-slate-200/70 shrink-0"
        >
          <button
            type="button"
            id="filter-all-btn"
            onClick={() => onStatusChange('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              status === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                status === 'all' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            id="filter-active-btn"
            onClick={() => onStatusChange('active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              status === 'active'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.active}
            </span>
          </button>

          <button
            type="button"
            id="filter-completed-btn"
            onClick={() => onStatusChange('completed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              status === 'completed'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Completed</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-tasks-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pl-9 pr-8 py-2 border border-slate-200 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Category filter, Priority filter, Sort By */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
              className="bg-slate-50 text-slate-700 rounded-md px-2 py-1 text-xs border border-slate-200 focus:outline-hidden focus:border-slate-400 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              id="filter-priority-select"
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value as Priority | 'All')}
              className="bg-slate-50 text-slate-700 rounded-md px-2 py-1 text-xs border border-slate-200 focus:outline-hidden focus:border-slate-400 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="reset-filters-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" /> Reset filters
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </span>
          <select
            id="sort-tasks-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-slate-50 text-slate-700 rounded-md px-2 py-1 text-xs border border-slate-200 focus:outline-hidden focus:border-slate-400 cursor-pointer"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
