import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '../api/index.js';

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
        onMutate: async (newCommentInput) => {
            await queryClient.cancelQueries({ queryKey: ['comments', requestId] });
            const previousComments = queryClient.getQueryData(['comments', requestId]);

            const optimisticComment = {
                id: `temp-${Date.now()}`,
                body: newCommentInput.text,
                authorName: newCommentInput.authorName,
                authorId: null, // Resolves correctly on success
                createdAt: new Date().toISOString(),
                isPending: true, // Marks this element visually
                canDelete: false
            };

            queryClient.setQueryData(['comments', requestId], (old = []) => [...old, optimisticComment]);

            return { previousComments };
        },
        onError: (err, variables, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(['comments', requestId], context.previousComments);
            }
        },
        onSettled: () => {
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
