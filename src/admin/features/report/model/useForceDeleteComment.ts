import { useMutation, useQueryClient } from '@tanstack/react-query';

import { forceDeleteComment } from '../api';

export function useForceDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => forceDeleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
