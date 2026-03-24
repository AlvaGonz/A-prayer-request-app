import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrayerRequests } from '../hooks/usePrayerRequests';
import * as ReactQuery from '@tanstack/react-query';

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn()
}));

// Mock api to prevent actual calls
vi.mock('../api', () => ({
  requestsAPI: {
    getAll: vi.fn()
  }
}));

describe('usePrayerRequests - Network First Strategy config', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures staleTime to 0 to ensure network requests are ALWAYS attempted (NetworkFirst)', () => {
    usePrayerRequests('open');
    const queryConfig = ReactQuery.useInfiniteQuery.mock.calls[0][0];

    // Assert that staleTime is explicitly forcing fresh network sweeps
    expect(queryConfig.staleTime).toBe(0);
  });

  it('configures gcTime to 5 minutes (300000ms) to allow fallback offline caching', () => {
    usePrayerRequests('open');
    const queryConfig = ReactQuery.useInfiniteQuery.mock.calls[0][0];

    expect(queryConfig.gcTime).toBe(5 * 60 * 1000);
  });

  it('enforces refetchOnMount and refetchOnWindowFocus to maximize freshness', () => {
    usePrayerRequests('open');
    const queryConfig = ReactQuery.useInfiniteQuery.mock.calls[0][0];

    // These should both explicitly be true (even though they are default)
    // To ensure aggressive refetch behavior isn't accidentally disabled
    expect(queryConfig.refetchOnMount).toBe(true);
    expect(queryConfig.refetchOnWindowFocus).toBe(true);
  });
});
