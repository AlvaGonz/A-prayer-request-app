import { useMutation } from '@tanstack/react-query';
import { requestsAPI } from '../api/index.js';

export const usePrayMutation = (requestId) => {
    return useMutation({
        mutationFn: async ({ isPraying }) => {
            if (isPraying) {
                return await requestsAPI.unpray(requestId);
            } else {
                return await requestsAPI.pray(requestId);
            }
        },
        onSuccess: (_data) => {
            // Opt-in to invalidate queries if we want absolute fresh data, 
            // though typically we'll use optimistic updates in the component itself.
            // queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
        }
    });
};
