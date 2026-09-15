import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserStatus } from '../api';
import type { AdminUserStatus } from './types';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: AdminUserStatus }) =>
      updateUserStatus(userId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
