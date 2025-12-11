import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
  id: '1',
  title: 'テストTODO',
  description: 'テスト説明',
  completed: false,
  priority: 'medium',
  category: '仕事',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getTodos', () => {
    it('localStorageが空の場合は空配列を返す', () => {
      const todos = storage.getTodos();
      expect(todos).toEqual([]);
    });

    it('保存されたTODOを取得できる', () => {
      localStorage.setItem('todos', JSON.stringify([mockTodo]));
      const todos = storage.getTodos();
      expect(todos).toEqual([mockTodo]);
    });

    it('複数のTODOを取得できる', () => {
      const mockTodos = [
        mockTodo,
        { ...mockTodo, id: '2', title: 'TODO2' },
        { ...mockTodo, id: '3', title: 'TODO3' },
      ];
      localStorage.setItem('todos', JSON.stringify(mockTodos));
      const todos = storage.getTodos();
      expect(todos).toEqual(mockTodos);
    });

    it('不正なJSONの場合は空配列を返す', () => {
      localStorage.setItem('todos', 'invalid json');
      const todos = storage.getTodos();
      expect(todos).toEqual([]);
    });
  });

  describe('saveTodos', () => {
    it('TODOをlocalStorageに保存できる', () => {
      storage.saveTodos([mockTodo]);
      const saved = localStorage.getItem('todos');
      expect(saved).toBe(JSON.stringify([mockTodo]));
    });

    it('複数のTODOを保存できる', () => {
      const mockTodos = [
        mockTodo,
        { ...mockTodo, id: '2', title: 'TODO2' },
      ];
      storage.saveTodos(mockTodos);
      const saved = localStorage.getItem('todos');
      expect(saved).toBe(JSON.stringify(mockTodos));
    });

    it('空配列を保存できる', () => {
      storage.saveTodos([]);
      const saved = localStorage.getItem('todos');
      expect(saved).toBe('[]');
    });
  });

  describe('addTodo', () => {
    it('新しいTODOを追加できる', () => {
      storage.addTodo(mockTodo);
      const todos = storage.getTodos();
      expect(todos).toEqual([mockTodo]);
    });

    it('既存のTODOに新しいTODOを追加できる', () => {
      storage.addTodo(mockTodo);
      const newTodo = { ...mockTodo, id: '2', title: 'TODO2' };
      storage.addTodo(newTodo);
      const todos = storage.getTodos();
      expect(todos).toEqual([mockTodo, newTodo]);
    });
  });

  describe('updateTodo', () => {
    beforeEach(() => {
      storage.saveTodos([mockTodo]);
    });

    it('TODOを更新できる', () => {
      storage.updateTodo('1', { title: '更新されたタイトル' });
      const todos = storage.getTodos();
      expect(todos[0].title).toBe('更新されたタイトル');
    });

    it('更新時にupdatedAtが更新される', () => {
      const beforeUpdate = new Date().toISOString();
      storage.updateTodo('1', { title: '更新されたタイトル' });
      const todos = storage.getTodos();
      expect(new Date(todos[0].updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeUpdate).getTime()
      );
    });

    it('複数のフィールドを同時に更新できる', () => {
      storage.updateTodo('1', {
        title: '更新されたタイトル',
        description: '更新された説明',
        priority: 'high',
      });
      const todos = storage.getTodos();
      expect(todos[0]).toMatchObject({
        title: '更新されたタイトル',
        description: '更新された説明',
        priority: 'high',
      });
    });

    it('存在しないTODOを更新しようとしても他のTODOに影響しない', () => {
      storage.updateTodo('999', { title: '存在しないTODO' });
      const todos = storage.getTodos();
      expect(todos).toEqual([mockTodo]);
    });
  });

  describe('deleteTodo', () => {
    beforeEach(() => {
      storage.saveTodos([
        mockTodo,
        { ...mockTodo, id: '2', title: 'TODO2' },
        { ...mockTodo, id: '3', title: 'TODO3' },
      ]);
    });

    it('TODOを削除できる', () => {
      storage.deleteTodo('1');
      const todos = storage.getTodos();
      expect(todos).toHaveLength(2);
      expect(todos.find(t => t.id === '1')).toBeUndefined();
    });

    it('複数のTODOから特定のTODOだけを削除できる', () => {
      storage.deleteTodo('2');
      const todos = storage.getTodos();
      expect(todos).toHaveLength(2);
      expect(todos.find(t => t.id === '2')).toBeUndefined();
      expect(todos.find(t => t.id === '1')).toBeDefined();
      expect(todos.find(t => t.id === '3')).toBeDefined();
    });

    it('存在しないTODOを削除しようとしても他のTODOに影響しない', () => {
      storage.deleteTodo('999');
      const todos = storage.getTodos();
      expect(todos).toHaveLength(3);
    });
  });

  describe('toggleTodo', () => {
    beforeEach(() => {
      storage.saveTodos([mockTodo]);
    });

    it('TODOの完了状態を切り替えられる', () => {
      storage.toggleTodo('1');
      const todos = storage.getTodos();
      expect(todos[0].completed).toBe(true);
    });

    it('完了状態を複数回切り替えられる', () => {
      storage.toggleTodo('1');
      expect(storage.getTodos()[0].completed).toBe(true);
      storage.toggleTodo('1');
      expect(storage.getTodos()[0].completed).toBe(false);
      storage.toggleTodo('1');
      expect(storage.getTodos()[0].completed).toBe(true);
    });

    it('切り替え時にupdatedAtが更新される', () => {
      const beforeToggle = new Date().toISOString();
      storage.toggleTodo('1');
      const todos = storage.getTodos();
      expect(new Date(todos[0].updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeToggle).getTime()
      );
    });

    it('存在しないTODOを切り替えようとしても他のTODOに影響しない', () => {
      storage.toggleTodo('999');
      const todos = storage.getTodos();
      expect(todos[0].completed).toBe(false);
    });
  });
});
