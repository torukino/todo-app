import { Todo } from '@/types/todo';

const STORAGE_KEY = 'todos';

export const storage = {
  getTodos: (): Todo[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveTodos: (todos: Todo[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addTodo: (todo: Todo): void => {
    const todos = storage.getTodos();
    storage.saveTodos([...todos, todo]);
  },

  updateTodo: (id: string, updates: Partial<Todo>): void => {
    const todos = storage.getTodos();
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    );
    storage.saveTodos(updatedTodos);
  },

  deleteTodo: (id: string): void => {
    const todos = storage.getTodos();
    storage.saveTodos(todos.filter(todo => todo.id !== id));
  },

  toggleTodo: (id: string): void => {
    const todos = storage.getTodos();
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    );
    storage.saveTodos(updatedTodos);
  }
};
