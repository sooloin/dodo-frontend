import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/react-query/queryKey';

import { getNearbyPopularActivities } from '../api/activityHistory';

interface UseNearbyPopularActivitiesParams {
  latitude: number | null;
  longitude: number | null;
  limit?: number;
}

export function useNearbyPopularActivities({ latitude, longitude, limit }: UseNearbyPopularActivitiesParams) {
  return useQuery({
    queryKey: queryKeys.activities.nearbyPopular({ latitude: latitude ?? 0, longitude: longitude ?? 0, limit }),
    queryFn: () => getNearbyPopularActivities({ latitude: latitude as number, longitude: longitude as number, limit }),
    enabled: latitude !== null && longitude !== null,
  });
}
