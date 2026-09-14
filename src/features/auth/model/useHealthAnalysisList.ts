import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getHealthAnalysisList, type GetHealthAnalysisListParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useHealthAnalysisList(petId: number | null, params?: GetHealthAnalysisListParams) {
  const isValidId = petId !== null && !Number.isNaN(petId);

  return useQuery({
    queryKey: isValidId ? queryKeys.pets.healthAnalysis.list(petId, params) : ['pets', 'health-analysis', 'idle'],
    queryFn: () => getHealthAnalysisList(petId as number, params),
    enabled: isValidId,
    placeholderData: keepPreviousData,
  });
}
