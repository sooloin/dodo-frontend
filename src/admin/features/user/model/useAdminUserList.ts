import { useQuery } from '@tanstack/react-query';

import { adminQueryKeys } from '@/admin/lib/queryKeys';

import { getAdminUsers } from '../api';
import type { GetAdminUsersParams } from './types';

export function useAdminUserList(params: GetAdminUsersParams) {
  return useQuery({
    queryKey: adminQueryKeys.users.list(params),
    queryFn: () => getAdminUsers(params),
  });
}
