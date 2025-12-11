import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm';
import { TodoFormData } from '@/types/todo';

describe('TodoForm', () => {
  it('正しくレンダリングされる', () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/タイトル/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/優先度/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/カテゴリ/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /追加/i })).toBeInTheDocument();
  });

  it('フォーム入力が正しく動作する', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const prioritySelect = screen.getByLabelText(/優先度/i);
    const categoryInput = screen.getByLabelText(/カテゴリ/i);

    await user.type(titleInput, 'テストTODO');
    await user.type(descriptionInput, 'テスト説明');
    await user.selectOptions(prioritySelect, 'high');
    await user.type(categoryInput, '仕事');

    expect(titleInput).toHaveValue('テストTODO');
    expect(descriptionInput).toHaveValue('テスト説明');
    expect(prioritySelect).toHaveValue('high');
    expect(categoryInput).toHaveValue('仕事');
  });

  it('フォーム送信が正しく動作する', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const prioritySelect = screen.getByLabelText(/優先度/i);
    const categoryInput = screen.getByLabelText(/カテゴリ/i);
    const submitButton = screen.getByRole('button', { name: /追加/i });

    await user.type(titleInput, 'テストTODO');
    await user.type(descriptionInput, 'テスト説明');
    await user.selectOptions(prioritySelect, 'high');
    await user.type(categoryInput, '仕事');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'テストTODO',
      description: 'テスト説明',
      priority: 'high',
      category: '仕事',
    });
  });

  it('送信後にフォームがリセットされる', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByRole('button', { name: /追加/i });

    await user.type(titleInput, 'テストTODO');
    await user.type(descriptionInput, 'テスト説明');
    await user.click(submitButton);

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  it('タイトルが空の場合は送信されない', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /追加/i });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('空白のみのタイトルは送信されない', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const submitButton = screen.getByRole('button', { name: /追加/i });

    await user.type(titleInput, '   ');
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('デフォルトの優先度は中になる', () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const prioritySelect = screen.getByLabelText(/優先度/i);
    expect(prioritySelect).toHaveValue('medium');
  });

  it('説明とカテゴリは任意項目として動作する', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const submitButton = screen.getByRole('button', { name: /追加/i });

    await user.type(titleInput, 'タイトルのみ');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'タイトルのみ',
      description: undefined,
      priority: 'medium',
      category: undefined,
    });
  });
});
