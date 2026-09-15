import { useQuery } from '@tanstack/react-query';

import { adminQueryKeys } from '@/admin/lib/queryKeys';

import { getAdminReports } from '../api';
import type { GetAdminReportsParams } from './types';

export function useAdminReportList(params: GetAdminReportsParams) {
  return useQuery({
    queryKey: adminQueryKeys.reports.list(params),
    queryFn: () => getAdminReports(params),
  });
}
