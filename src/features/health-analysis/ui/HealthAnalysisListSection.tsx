import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  getApiErrorMessage,
  HEALTH_ANALYSIS_LIST_STATUS_MESSAGES,
  HEALTH_ANALYSIS_MUTATION_STATUS_MESSAGES,
  useDeleteHealthAnalysis,
  useHealthAnalysisList,
} from '@/features/auth';

import {
  formatAnalysisDate,
  formatAnalysisStatusLabel,
  formatAnalysisTypeLabel,
  formatHealthAnalysisDisplayTitle,
} from '../lib/formatters';
import { HealthAnalysisDeleteDialog } from './HealthAnalysisDeleteDialog';

const PAGE_SIZE = 10;

interface HealthAnalysisListSectionProps {
  petId: number;
  petName: string;
}

export function HealthAnalysisListSection({ petId, petName }: HealthAnalysisListSectionProps) {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = useHealthAnalysisList(petId, { page, size: PAGE_SIZE });
  const { mutateAsync: removeAnalysis, isPending: isDeleting } = useDeleteHealthAnalysis();
  const [deleteError, setDeleteError] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const analyses = data?.data ?? [];
  const pageInfo = data?.pageInfo;

  const handleConfirmDelete = async () => {
    if (pendingDeleteId === null) return;

    setDeleteError('');

    try {
      await removeAnalysis({ petId, analysisId: pendingDeleteId });
      setPendingDeleteId(null);
    } catch (deleteErrorValue) {
      setDeleteError(
        getApiErrorMessage(
          deleteErrorValue,
          '건강 분석 삭제에 실패했어요. 잠시 후 다시 시도해주세요.',
          HEALTH_ANALYSIS_MUTATION_STATUS_MESSAGES,
        ),
      );
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">HISTORY</p>
        <h2 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">분석 기록</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">건강 분석 기록을 불러오는 중이에요...</p>
      ) : isError ? (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-4">
          <p className="text-sm text-red-600">
            {getApiErrorMessage(error, '건강 분석 기록을 불러오지 못했어요.', HEALTH_ANALYSIS_LIST_STATUS_MESSAGES)}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      ) : analyses.length === 0 ? (
        <article className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-neutral-600">등록된 건강 분석 결과가 없습니다.</p>
        </article>
      ) : (
        <div className="space-y-2.5">
          {analyses.map((item) => (
            <article key={item.analysisId} className="rounded-[16px] border border-neutral-200 bg-white px-4 py-3.5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                      {formatAnalysisTypeLabel(item.analysisType)}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                      {formatAnalysisStatusLabel(item.analysisStatus)}
                    </span>
                    <span className="text-xs text-neutral-400">{formatAnalysisDate(item.analysisDate)}</span>
                  </div>
                  <p className="mt-1.5 truncate text-[15px] font-medium text-neutral-900">
                    {formatHealthAnalysisDisplayTitle(petName, item.analysisType)}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-neutral-500">{item.healthAnalysisSummary}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/my/pets/${petId}/health/${item.analysisId}`}
                    className="inline-flex h-9 min-w-18 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    상세보기
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(item.analysisId)}
                    className="inline-flex h-9 min-w-18 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pageInfo && pageInfo.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={pageInfo.page <= 0}
            onClick={() => setPage(pageInfo.page - 1)}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-sm text-neutral-500">
            {pageInfo.page + 1} / {pageInfo.totalPages}
          </span>
          <button
            type="button"
            disabled={pageInfo.page >= pageInfo.totalPages - 1}
            onClick={() => setPage(pageInfo.page + 1)}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      ) : null}

      <HealthAnalysisDeleteDialog
        open={pendingDeleteId !== null}
        isPending={isDeleting}
        errorMessage={deleteError}
        onClose={() => {
          if (isDeleting) return;
          setPendingDeleteId(null);
          setDeleteError('');
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </section>
  );
}
