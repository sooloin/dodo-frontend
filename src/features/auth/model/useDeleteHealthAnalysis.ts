import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteHealthAnalysis } from '@/features/auth/api/pets';
import type { DeleteHealthAnalysisResponse } from '@/features/auth/model/types';

interface DeleteHealthAnalysisVariables {
  petId: number;
  analysisId: number;
}

export function useDeleteHealthAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<DeleteHealthAnalysisResponse, unknown, DeleteHealthAnalysisVariables>({
    mutationFn: ({ analysisId }) => deleteHealthAnalysis(analysisId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', variables.petId, 'health-analysis'],
      });
    },
  });
}
