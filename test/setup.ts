import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// テスト後のクリーンアップ
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// crypto.randomUUID のモック
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => vi.fn(() => Math.random().toString(36).substring(2, 11))(),
  },
});
