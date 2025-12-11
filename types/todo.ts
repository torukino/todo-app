export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
}
