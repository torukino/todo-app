'use client';

import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      category: editCategory.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditCategory(todo.category || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タイトル"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="説明"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="カテゴリ"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(todo.priority)}`}>
              優先度: {getPriorityLabel(todo.priority)}
            </span>
            {todo.category && (
              <span className="px-2 py-1 text-xs font-medium rounded border bg-blue-100 text-blue-800 border-blue-300">
                {todo.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
