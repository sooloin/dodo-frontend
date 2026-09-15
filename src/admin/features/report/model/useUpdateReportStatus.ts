import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateReportStatus } from '../api';
import type { AdminReportStatus } from './types';

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: number; status: AdminReportStatus }) =>
      updateReportStatus(reportId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
