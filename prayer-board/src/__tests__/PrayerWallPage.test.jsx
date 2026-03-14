import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrayerWallPage from '../pages/PrayerWallPage';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

// Create mock functions
const mockUsePrayerRequests = vi.fn();
const mockUseCreatePrayerRequest = vi.fn(() => ({ mutate: vi.fn(), isPending: false }));
const mockUseUpdatePrayerStatus = vi.fn(() => ({ mutate: vi.fn() }));
const mockUseDeletePrayerRequest = vi.fn(() => ({ mutate: vi.fn() }));
const mockUseMarkAnswered = vi.fn(() => ({ mutate: vi.fn() }));

// Mock the hooks module
vi.mock('../hooks/usePrayerRequests', () => ({
  usePrayerRequests: (...args) => mockUsePrayerRequests(...args),
  useCreatePrayerRequest: (...args) => mockUseCreatePrayerRequest(...args),
  useUpdatePrayerStatus: (...args) => mockUseUpdatePrayerStatus(...args),
  useDeletePrayerRequest: (...args) => mockUseDeletePrayerRequest(...args),
  useMarkAnswered: (...args) => mockUseMarkAnswered(...args),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
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

describe('PrayerWallPage - Answered Prayers Section', () => {
  let testQueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient = createTestQueryClient();
    
    // Default open/pending state mocking
    mockUsePrayerRequests.mockImplementation((statusFilter) => {
      const isAnswered = statusFilter === 'answered';
      return {
        data: {
          pages: [
            {
              requests: isAnswered
                ? [
                    { id: '2', body: 'Answered pray', status: 'answered', authorName: 'John', createdAt: new Date().toISOString() }
                  ]
                : [
                    { id: '1', body: 'Open pray', status: 'open', authorName: 'Jane', createdAt: new Date().toISOString() }
                  ],
              pagination: { currentPage: 1, totalPages: 1 }
            }
          ]
        },
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
      };
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={testQueryClient}>
        <AuthProvider>
          <ThemeProvider>
            <PrayerWallPage />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('renders both open and answered tabs', () => {
    renderComponent();
    expect(screen.getByText('prayerWall.filterPending')).toBeInTheDocument();
    expect(screen.getByText('prayerWall.filterAnswered')).toBeInTheDocument();
  });

  it('defaults to showing open (pending) requests', () => {
    renderComponent();
    expect(mockUsePrayerRequests).toHaveBeenCalledWith('open');
    expect(screen.getByText('Open pray')).toBeInTheDocument();
    expect(screen.queryByText('Answered pray')).not.toBeInTheDocument();
  });

  it('filters to answered requests when Answered tab is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('prayerWall.filterAnswered'));
    
    await waitFor(() => {
      expect(mockUsePrayerRequests).toHaveBeenCalledWith('answered');
    });
    
    // Check that we're passing the 'answered' filter internally.
    // the mock handles returning 'Answered pray' specifically when filtered.
  });

  it('updates aria-selected for tabs', () => {
    renderComponent();
    const pendingTab = screen.getByRole('tab', { name: 'prayerWall.filterPending' });
    const answeredTab = screen.getByRole('tab', { name: 'prayerWall.filterAnswered' });
    
    expect(pendingTab).toHaveAttribute('aria-selected', 'true');
    expect(answeredTab).toHaveAttribute('aria-selected', 'false');
    
    fireEvent.click(answeredTab);
    
    expect(pendingTab).toHaveAttribute('aria-selected', 'false');
    expect(answeredTab).toHaveAttribute('aria-selected', 'true');
  });

  it('display visual badge logic is present via mocked requests', async () => {
    // Force mount the Answered view so the card gets rendered with the 'answered' state
    mockUsePrayerRequests.mockImplementation(() => {
      return {
        data: {
          pages: [
            {
              requests: [
                { id: '2', body: 'Answered pray', status: 'answered', authorName: 'John', createdAt: new Date().toISOString() }
              ],
              pagination: { currentPage: 1, totalPages: 1 }
            }
          ]
        },
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
      };
    });
    
    renderComponent();
    // Verify the Answered badge text is rendered in the card.
    expect(screen.getByText('prayerCard.answered')).toBeInTheDocument();
  });
});
