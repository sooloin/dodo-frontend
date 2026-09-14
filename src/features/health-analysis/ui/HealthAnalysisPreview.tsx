import { useHealthAnalysisList } from '@/features/auth';

import { formatAnalysisDate, formatHealthAnalysisDisplayTitle } from '../lib/formatters';

interface HealthAnalysisPreviewProps {
  petId: number;
  petName: string;
}

export function HealthAnalysisPreview({ petId, petName }: HealthAnalysisPreviewProps) {
  const { data, isLoading, isError } = useHealthAnalysisList(petId, { page: 0, size: 1 });

  const latestAnalysis = data?.data[0] ?? null;

  if (isLoading) {
    return <p className="text-sm text-neutral-500">건강 분석 결과를 불러오는 중이에요...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-[16px] border border-red-100 bg-red-50/50 px-4 py-4">
        <p className="text-sm leading-6 text-red-600">건강 분석 결과를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (!latestAnalysis) {
    return (
      <div className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <p className="text-sm leading-6 text-neutral-600">아직 생성된 건강 분석 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4 sm:px-5">
      <p className="truncate text-[15px] font-semibold text-neutral-900">
        {formatHealthAnalysisDisplayTitle(petName, latestAnalysis.analysisType)}
      </p>
      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-neutral-600">{latestAnalysis.healthAnalysisSummary}</p>
      <p className="mt-2 text-xs text-neutral-400">{formatAnalysisDate(latestAnalysis.analysisDate)}</p>
    </div>
  );
}
