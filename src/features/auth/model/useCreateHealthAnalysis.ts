import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createHealthAnalysis } from '@/features/auth/api/pets';
import type { CreateHealthAnalysisRequest, CreateHealthAnalysisResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface CreateHealthAnalysisVariables {
  petId: number;
  payload: CreateHealthAnalysisRequest;
}

export function useCreateHealthAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<CreateHealthAnalysisResponse, unknown, CreateHealthAnalysisVariables>({
    mutationFn: ({ petId, payload }) => createHealthAnalysis(petId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', variables.petId, 'health-analysis'],
      });
      // 홈 AI 건강 레포트가 같은 데이터를 참조할 수도 있어 함께 무효화 (별개 모델이면 무해함)
      void queryClient.invalidateQueries({ queryKey: queryKeys.main.home() });
    },
  });
}
