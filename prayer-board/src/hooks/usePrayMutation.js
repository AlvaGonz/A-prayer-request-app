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
        }
    });
};
