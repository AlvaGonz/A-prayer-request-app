import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import PrayedButton from '../components/PrayedButton';

// Mock react-i18next with proper interpolation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            // Handle interpolation in translation keys
            if (options && options.count !== undefined) {
                return `${key} ${options.count}`;
            }
            return key;
        }
    }),
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ isAuthenticated: true, user: { id: '1' } }),
}));

// Mock usePrayMutation with a proper mutation structure
const mockMutateAsync = vi.fn();
vi.mock('../hooks/usePrayMutation', () => ({
    usePrayMutation: () => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
    }),
}));

// Mock safeStorage
vi.mock('../utils/storage', () => ({
    safeStorage: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    },
}));

describe('PrayedButton Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock return value for successful prayer
        mockMutateAsync.mockResolvedValue({ prayedCount: 6 });
    });

    it('renders with initial count', () => {
        render(<PrayedButton requestId="123" initialCount={5} onPrayed={() => { }} />);
        // The button shows the translation key with count in the button element
        // Use getAllByText since the text appears twice (in button and reveal div)
        const elements = screen.getAllByText(/prayerCard\.iPrayed/);
        expect(elements.length).toBeGreaterThan(0);
        // Check that one of them contains "5"
        expect(elements.some(el => el.textContent.includes('5'))).toBe(true);
    });

    it('increments count on click', async () => {
        render(
            <PrayedButton
                requestId="123"
                initialCount={5}
                onPrayed={() => { }}
            />
        );

        // Find and click the button
        const button = screen.getByRole('button');
        fireEvent.click(button);

        // Wait for the optimistic update to reflect in the DOM
        // The button text should change to show "prayerCard.prayed 6"
        await waitFor(() => {
            const elements = screen.getAllByText(/prayerCard/);
            // Check that the count incremented to 6
            expect(elements.some(el => el.textContent.includes('6'))).toBe(true);
        });

        // Verify the mutation was called
        expect(mockMutateAsync).toHaveBeenCalledWith({ isPraying: false });
    });
});
