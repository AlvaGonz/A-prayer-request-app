import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsAPI } from '../api';

export const usePrayMutation = (requestId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ isPraying }) => {
            if (isPraying) {
                return await requestsAPI.unpray(requestId);
            } else {
                return await requestsAPI.pray(requestId);
            }
        },
        onSuccess: (data) => {
            // Opt-in to invalidate queries if we want absolute fresh data, 
            // though typically we'll use optimistic updates in the component itself.
            // queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
        }
    });
};
