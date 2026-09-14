import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateHealthAnalysis } from '@/features/auth/api/pets';
import type { UpdateHealthAnalysisRequest, UpdateHealthAnalysisResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface UpdateHealthAnalysisVariables {
  petId: number;
  analysisId: number;
  payload: UpdateHealthAnalysisRequest;
}

export function useUpdateHealthAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<UpdateHealthAnalysisResponse, unknown, UpdateHealthAnalysisVariables>({
    mutationFn: ({ analysisId, payload }) => updateHealthAnalysis(analysisId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', variables.petId, 'health-analysis'],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.healthAnalysis.detail(variables.analysisId),
      });
    },
  });
}
