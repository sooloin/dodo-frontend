import { useQuery } from '@tanstack/react-query';

import { adminQueryKeys } from '@/admin/lib/queryKeys';

import { getAnnouncements } from '../api';
import type { GetAnnouncementsParams } from './types';

export function useAnnouncementList(params?: GetAnnouncementsParams) {
  return useQuery({
    queryKey: adminQueryKeys.announcements.list(params),
    queryFn: () => getAnnouncements(params),
  });
}
