import { useMutation, useQueryClient } from '@tanstack/react-query';

import { forceDeleteBoard } from '../api';

export function useForceDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId: number) => forceDeleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
