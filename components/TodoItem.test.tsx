import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';
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

describe('TodoItem', () => {
  it('TODOが正しくレンダリングされる', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('テストTODO')).toBeInTheDocument();
    expect(screen.getByText('テスト説明')).toBeInTheDocument();
    expect(screen.getByText('仕事')).toBeInTheDocument();
    expect(screen.getByText(/優先度: 中/i)).toBeInTheDocument();
  });

  it('チェックボックスをクリックするとonToggleが呼ばれる', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('編集ボタンをクリックすると編集モードになる', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const editButton = screen.getByRole('button', { name: /編集/i });
    await user.click(editButton);

    expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /キャンセル/i })).toBeInTheDocument();
  });

  it('編集モードで保存するとonUpdateが呼ばれる', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const editButton = screen.getByRole('button', { name: /編集/i });
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue('テストTODO');
    await user.clear(titleInput);
    await user.type(titleInput, '更新されたTODO');

    const saveButton = screen.getByRole('button', { name: /保存/i });
    await user.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      title: '更新されたTODO',
      description: 'テスト説明',
      priority: 'medium',
      category: '仕事',
    });
  });

  it('編集モードでキャンセルすると変更が破棄される', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const editButton = screen.getByRole('button', { name: /編集/i });
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue('テストTODO');
    await user.clear(titleInput);
    await user.type(titleInput, '変更されたTODO');

    const cancelButton = screen.getByRole('button', { name: /キャンセル/i });
    await user.click(cancelButton);

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('テストTODO')).toBeInTheDocument();
  });

  it('完了したTODOは打ち消し線が表示される', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const title = screen.getByText('テストTODO');
    expect(title).toHaveClass('line-through');
  });

  it('優先度が高の場合は赤い背景で表示される', () => {
    const highPriorityTodo: Todo = { ...mockTodo, priority: 'high' };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={highPriorityTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const priorityBadge = screen.getByText(/優先度: 高/i);
    expect(priorityBadge).toHaveClass('bg-red-100');
  });

  it('優先度が中の場合は黄色い背景で表示される', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const priorityBadge = screen.getByText(/優先度: 中/i);
    expect(priorityBadge).toHaveClass('bg-yellow-100');
  });

  it('優先度が低の場合は緑の背景で表示される', () => {
    const lowPriorityTodo: Todo = { ...mockTodo, priority: 'low' };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={lowPriorityTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const priorityBadge = screen.getByText(/優先度: 低/i);
    expect(priorityBadge).toHaveClass('bg-green-100');
  });

  it('説明がない場合は説明が表示されない', () => {
    const todoWithoutDescription: Todo = { ...mockTodo, description: undefined };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={todoWithoutDescription}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.queryByText('テスト説明')).not.toBeInTheDocument();
  });

  it('カテゴリがない場合はカテゴリバッジが表示されない', () => {
    const todoWithoutCategory: Todo = { ...mockTodo, category: undefined };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();

    render(
      <TodoItem
        todo={todoWithoutCategory}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.queryByText('仕事')).not.toBeInTheDocument();
  });
});
