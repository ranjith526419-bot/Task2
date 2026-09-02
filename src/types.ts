export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Personal' | 'Work' | 'Shopping' | 'Health' | 'Learning' | 'General';

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption = 'created_desc' | 'created_asc' | 'due_date' | 'priority' | 'alphabetical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number; // timestamp
  completedAt?: number; // timestamp
}
