import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CommentSection from '../components/CommentSection';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

// Mocks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

vi.mock('../hooks/useComments', () => ({
  useComments: vi.fn(),
  useCreateComment: vi.fn(),
  useUpdateComment: vi.fn(() => ({ mutate: vi.fn() })),
  useDeleteComment: vi.fn(() => ({ mutate: vi.fn() }))
}));

const { useComments, useCreateComment } = require('../hooks/useComments');

describe('CommentSection - Optimistic Updates', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default useComments returns valid list
    useComments.mockReturnValue({
      data: [{ id: '1', body: 'Existing comment', authorName: 'Alice', createdAt: new Date().toISOString() }],
      isLoading: false
    });

    useCreateComment.mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });
  });

  const renderComponent = () => render(
    <AuthProvider>
      <ThemeProvider>
        <CommentSection requestId="req-123" onClose={vi.fn()} requestAuthorId="author-1" />
      </ThemeProvider>
    </AuthProvider>
  );

  it('renders existing comments and the form', () => {
    renderComponent();
    expect(screen.getByText('Existing comment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('comments.placeholder')).toBeInTheDocument();
  });

  it('submits a comment calling mutate without awaiting completion', async () => {
    renderComponent();
    
    const input = screen.getByPlaceholderText('comments.placeholder');
    fireEvent.change(input, { target: { value: 'New hopeful comment' } });
    
    const submitBtn = screen.getByLabelText('comments.send');
    fireEvent.click(submitBtn);

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'New hopeful comment' }),
      expect.any(Object)
    );
  });

  it('clears comment input immediately after submit click (optimistic UX)', async () => {
    renderComponent();
    
    const input = screen.getByPlaceholderText('comments.placeholder');
    fireEvent.change(input, { target: { value: 'Opti comment' } });
    
    const submitBtn = screen.getByLabelText('comments.send');
    fireEvent.click(submitBtn);

    // Should clear immediately
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays a pending indicator if comment is marked pending', () => {
    // Inject optimistic pending comment
    useComments.mockReturnValue({
      data: [{ id: 'temp-1', body: 'Pending comment', authorName: 'User', createdAt: new Date().toISOString(), pending: true }],
      isLoading: false
    });
    
    renderComponent();
    
    expect(screen.getByText('Pending comment')).toBeInTheDocument();
    // In our component, we should add a data-testid="pending-indicator" or visual cue
    expect(screen.getByTestId('pending-indicator')).toBeInTheDocument();
  });
});
