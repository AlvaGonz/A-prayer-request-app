import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsAPI } from '../api/index.js';

export const usePrayerRequests = (statusFilter = 'open') => {
    return useInfiniteQuery({
        queryKey: ['prayerRequests', statusFilter],
        queryFn: async ({ pageParam = 1 }) => {
            return await requestsAPI.getAll({
                page: pageParam,
                limit: pageParam === 1 ? 10 : 20,
                status: statusFilter
            });
        },
        initialPageParam: 1,
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.pagination) return undefined;
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        }
    });
};

export const useCreatePrayerRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, user }) => {
            return await requestsAPI.create(data, user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
        }
    });
};

export const useUpdatePrayerStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, data, user }) => {
            return await requestsAPI.updateStatus(requestId, data, user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
        }
    });
};

export const useMarkAnswered = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, testimony }) => {
            return await requestsAPI.markAnswered(requestId, { testimony });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
        }
    });
};

export const useDeletePrayerRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, user }) => {
            return await requestsAPI.delete(requestId, user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
        }
    });
};
