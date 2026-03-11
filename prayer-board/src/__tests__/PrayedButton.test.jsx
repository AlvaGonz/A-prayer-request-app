import { render, screen, fireEvent } from '@testing-library/react';
import PrayedButton from '../components/PrayedButton';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ isAuthenticated: true, user: { id: '1' } }),
}));

vi.mock('../hooks/usePrayMutation', () => ({
    usePrayMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe('PrayedButton Component', () => {
    it('renders with initial count', () => {
        render(<PrayedButton requestId="123" initialCount={5} onPrayed={() => { }} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('increments count on click', () => {
        let mockOnPrayed = null;
        const { getByRole } = render(
            <PrayedButton
                requestId="123"
                initialCount={5}
                onPrayed={(id, cnt) => { mockOnPrayed = cnt; }}
            />
        );

        // The button has a title or class we can click
        const button = getByRole('button');
        fireEvent.click(button);

        // Since it's an optimistic update, the text changes immediately to 6
        expect(screen.getByText('6')).toBeInTheDocument();
    });
});
