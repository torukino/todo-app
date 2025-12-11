'use client';

import { useEffect, useState } from 'react';
import { Todo, TodoFormData, Priority } from '@/types/todo';
import { storage } from '@/lib/storage';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    setTodos(storage.getTodos());
  }, []);

  const handleAddTodo = (data: TodoFormData) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addTodo(newTodo);
    setTodos(storage.getTodos());
  };

  const handleToggleTodo = (id: string) => {
    storage.toggleTodo(id);
    setTodos(storage.getTodos());
  };

  const handleDeleteTodo = (id: string) => {
    storage.deleteTodo(id);
    setTodos(storage.getTodos());
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    storage.updateTodo(id, updates);
    setTodos(storage.getTodos());
  };

  const categories = Array.from(new Set(todos.map(todo => todo.category).filter(Boolean))) as string[];

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
    const matchesCompleted = filterCompleted === 'all' ||
      (filterCompleted === 'active' && !todo.completed) ||
      (filterCompleted === 'completed' && todo.completed);

    return matchesSearch && matchesPriority && matchesCategory && matchesCompleted;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TODOアプリ</h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>全体: {stats.total}</span>
            <span>未完了: {stats.active}</span>
            <span>完了: {stats.completed}</span>
          </div>
        </header>

        <div className="mb-8">
          <TodoForm onSubmit={handleAddTodo} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">検索・フィルター</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                検索
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タイトルや説明で検索..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="filterPriority" className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  id="filterPriority"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">すべて</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ
                </label>
                <select
                  id="filterCategory"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">すべて</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filterCompleted" className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス
                </label>
                <select
                  id="filterCompleted"
                  value={filterCompleted}
                  onChange={(e) => setFilterCompleted(e.target.value as 'all' | 'active' | 'completed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">すべて</option>
                  <option value="active">未完了</option>
                  <option value="completed">完了</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              {todos.length === 0 ? 'TODOがありません。上のフォームから追加してください。' : '該当するTODOが見つかりません。'}
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
