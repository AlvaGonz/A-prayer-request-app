import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CommentSection from '../components/CommentSection';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { SocketProvider } from '../context/SocketContext';

// Create mock functions
const mockUseComments = vi.fn();
const mockUseCreateComment = vi.fn();
const mockUseUpdateComment = vi.fn(() => ({ mutate: vi.fn() }));
const mockUseDeleteComment = vi.fn(() => ({ mutate: vi.fn() }));

// Mock the hooks module
vi.mock('../hooks/useComments', () => ({
  useComments: (...args) => mockUseComments(...args),
  useCreateComment: (...args) => mockUseCreateComment(...args),
  useUpdateComment: (...args) => mockUseUpdateComment(...args),
  useDeleteComment: (...args) => mockUseDeleteComment(...args),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('CommentSection - Optimistic Updates', () => {
  const mockMutate = vi.fn();
  let testQueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient = createTestQueryClient();
    
    // Default useComments returns valid list
    mockUseComments.mockReturnValue({
      data: [{ id: '1', body: 'Existing comment', authorName: 'Alice', createdAt: new Date().toISOString() }],
      isLoading: false
    });

    mockUseCreateComment.mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });
  });

  const renderComponent = () => render(
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SocketProvider>
            <CommentSection requestId="req-123" onClose={() => {}} requestAuthorId="author-1" />
          </SocketProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
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
    mockUseComments.mockReturnValue({
      data: [{ id: 'temp-1', body: 'Pending comment', authorName: 'User', createdAt: new Date().toISOString(), pending: true }],
      isLoading: false
    });
    
    renderComponent();
    
    expect(screen.getByText('Pending comment')).toBeInTheDocument();
    // In our component, we should add a data-testid="pending-indicator" or visual cue
    expect(screen.getByTestId('pending-indicator')).toBeInTheDocument();
  });
});
