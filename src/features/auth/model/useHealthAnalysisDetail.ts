import { useQuery } from '@tanstack/react-query';

import { getHealthAnalysisDetail } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useHealthAnalysisDetail(analysisId: number | null) {
  const isValidId = analysisId !== null && !Number.isNaN(analysisId);

  return useQuery({
    queryKey: isValidId
      ? queryKeys.pets.healthAnalysis.detail(analysisId)
      : ['pets', 'health-analysis', 'detail', 'idle'],
    queryFn: () => getHealthAnalysisDetail(analysisId as number),
    enabled: isValidId,
  });
}
