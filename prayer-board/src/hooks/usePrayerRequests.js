import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsAPI } from '../api';

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
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.pagination) return undefined;
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
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
