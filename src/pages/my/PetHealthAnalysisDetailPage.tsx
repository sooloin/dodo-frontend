import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  getApiErrorMessage,
  HEALTH_ANALYSIS_MUTATION_STATUS_MESSAGES,
  useCurrentUser,
  useDeleteHealthAnalysis,
  useHealthAnalysisDetail,
  usePetDetail,
  useUpdateHealthAnalysis,
} from '@/features/auth';
import {
  HealthAnalysisContentView,
  HealthAnalysisDeleteDialog,
  formatAnalysisDate,
  formatAnalysisStatusLabel,
  formatAnalysisTypeLabel,
  formatHealthAnalysisDisplayTitle,
} from '@/features/health-analysis';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { LoadingSpinner } from '@/shared/ui';

function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function PetHealthAnalysisDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const analysisId = useMemo(() => parseId(params.analysisId), [params.analysisId]);

  const { user, profileUrl, displayName, isLoading: isUserLoading } = useCurrentUser();
  const { data, isLoading, isError, error, refetch } = useHealthAnalysisDetail(analysisId);
  const { data: petDetail } = usePetDetail(data?.petId ?? null);
  const { mutateAsync: updateAnalysis, isPending: isUpdating } = useUpdateHealthAnalysis();
  const { mutateAsync: removeAnalysis, isPending: isDeleting } = useDeleteHealthAnalysis();

  const [isEditing, setIsEditing] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const startEditing = () => {
    if (!data) return;
    setSummaryDraft(data.healthAnalysisSummary);
    setFormError('');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!data) return;

    setFormError('');

    try {
      await updateAnalysis({
        petId: data.petId,
        analysisId: data.analysisId,
        payload: { healthAnalysisSummary: summaryDraft },
      });
      setIsEditing(false);
    } catch (updateError) {
      setFormError(
        getApiErrorMessage(
          updateError,
          '건강 분석 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
          HEALTH_ANALYSIS_MUTATION_STATUS_MESSAGES,
        ),
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!data) return;

    setDeleteError('');

    try {
      await removeAnalysis({ petId: data.petId, analysisId: data.analysisId });
      navigate(`/my/pets/${data.petId}/health`);
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

  let content;
  if (analysisId === null) {
    content = (
      <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-10 shadow-sm">
        <h1 className="text-[20px] font-medium text-neutral-950">올바르지 않은 경로예요.</h1>
      </div>
    );
  } else if (isLoading) {
    content = (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[20px] border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-neutral-500">건강 분석 상세 정보를 불러오는 중...</p>
      </div>
    );
  } else if (isError || !data) {
    content = (
      <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-10 shadow-sm">
        <h1 className="text-[20px] font-medium text-neutral-950">건강 분석 정보를 불러오지 못했어요.</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          {getApiErrorMessage(error, '잠시 후 다시 시도해주세요.')}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          다시 시도
        </button>
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">HEALTH ANALYSIS</p>
            <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">건강 분석 상세</h1>
          </div>
          <Link
            to={`/my/pets/${data.petId}/health`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
          >
            목록으로
          </Link>
        </div>

        <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                {formatAnalysisTypeLabel(data.analysisType)}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                {formatAnalysisStatusLabel(data.analysisStatus)}
              </span>
              <span className="text-xs text-neutral-400">{formatAnalysisDate(data.analysisDate)}</span>
            </div>

            <h2 className="mt-4 text-[20px] font-semibold text-neutral-950">
              {formatHealthAnalysisDisplayTitle(petDetail?.petName ?? '반려동물', data.analysisType)}
            </h2>

            {isEditing ? (
              <div className="mt-3 space-y-3">
                <textarea
                  value={summaryDraft}
                  onChange={(event) => setSummaryDraft(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
                />
                {formError ? <p className="text-sm text-red-500">{formError}</p> : null}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSummaryDraft(data.healthAnalysisSummary);
                      setFormError('');
                    }}
                    disabled={isUpdating}
                    className="inline-flex h-10 min-w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveEdit()}
                    disabled={isUpdating}
                    className="inline-flex h-10 min-w-20 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{data.healthAnalysisSummary}</p>
                {formError ? <p className="mt-2 text-sm text-red-500">{formError}</p> : null}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="rounded-[20px] border border-neutral-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">DETAIL</p>
          <h2 className="mt-2 text-[16px] font-medium text-neutral-950">상세 분석 내용</h2>
          <div className="mt-4">
            <HealthAnalysisContentView content={data.healthAnalysisFullContent} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <MyDodoLayout
        sidebar={
          <MyDodoSidebarPanel
            user={user}
            profileUrl={profileUrl}
            displayName={displayName}
            isLoading={isUserLoading}
            activeKey="pet-list"
          />
        }
        content={content}
      />

      <HealthAnalysisDeleteDialog
        open={deleteDialogOpen}
        isPending={isDeleting}
        errorMessage={deleteError}
        onClose={() => {
          if (isDeleting) return;
          setDeleteDialogOpen(false);
          setDeleteError('');
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
