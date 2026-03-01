import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '../api';

export const useComments = (requestId, isOpen) => {
    return useQuery({
        queryKey: ['comments', requestId],
        queryFn: async () => {
            const data = await commentsAPI.getByRequest(requestId);
            return data.comments || [];
        },
        enabled: isOpen,
    });
};

export const useCreateComment = (requestId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ text, authorName, isAnonymous, guestId }) => {
            const commentData = { body: text, authorName, isAnonymous, guestId };
            return await commentsAPI.create(requestId, commentData);
        },
        onSuccess: (result) => {
            // Invalidate both the comments thread and optionally the prayer requests list if comment counts are needed there
            queryClient.invalidateQueries({ queryKey: ['comments', requestId] });
        }
    });
};

export const useUpdateComment = (requestId, guestId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, newText }) => {
            return await commentsAPI.update(commentId, { body: newText, guestId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', requestId] });
        }
    });
};

export const useDeleteComment = (requestId, user) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId) => {
            return await commentsAPI.delete(commentId, user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', requestId] });
        }
    });
};
