import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PrayerWallPage from '../pages/PrayerWallPage';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

// Mocks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  })
}));

vi.mock('../hooks/usePrayerRequests', () => ({
  usePrayerRequests: vi.fn(),
  useCreatePrayerRequest: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUpdatePrayerStatus: vi.fn(() => ({ mutate: vi.fn() })),
  useDeletePrayerRequest: vi.fn(() => ({ mutate: vi.fn() })),
  useMarkAnswered: vi.fn(() => ({ mutate: vi.fn() }))
}));

// Mock API responses
const { usePrayerRequests } = require('../hooks/usePrayerRequests');

describe('PrayerWallPage - Answered Prayers Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default open/pending state mocking
    usePrayerRequests.mockImplementation((statusFilter) => {
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
      <AuthProvider>
        <ThemeProvider>
          <PrayerWallPage />
        </ThemeProvider>
      </AuthProvider>
    );
  };

  it('renders both open and answered tabs', () => {
    renderComponent();
    expect(screen.getByText('prayerWall.filterPending')).toBeInTheDocument();
    expect(screen.getByText('prayerWall.filterAnswered')).toBeInTheDocument();
  });

  it('defaults to showing open (pending) requests', () => {
    renderComponent();
    expect(usePrayerRequests).toHaveBeenCalledWith('open');
    expect(screen.getByText('Open pray')).toBeInTheDocument();
    expect(screen.queryByText('Answered pray')).not.toBeInTheDocument();
  });

  it('filters to answered requests when Answered tab is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('prayerWall.filterAnswered'));
    
    await waitFor(() => {
      expect(usePrayerRequests).toHaveBeenCalledWith('answered');
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
    usePrayerRequests.mockImplementation(() => {
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
