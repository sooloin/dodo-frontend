import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCurrentUser, usePetDetail } from '@/features/auth';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet-detail';
import { HealthAnalysisCreateForm, HealthAnalysisListSection } from '@/features/health-analysis';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

export function PetHealthAnalysisPage() {
  const { petId } = useParams();
  const numericPetId = useMemo(() => {
    if (!petId) return null;

    const parsed = Number(petId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [petId]);

  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const { data, isLoading: isDetailLoading, isError, error } = usePetDetail(numericPetId);

  let content;
  if (isDetailLoading) {
    content = <PetDetailSkeleton />;
  } else if (isError || numericPetId === null || !data) {
    content = <PetDetailError message={getApiErrorMessage(error, '건강 분석 정보를 불러오지 못했습니다.')} />;
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">HEALTH ANALYSIS</p>
            <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">
              {data.petName}의 AI 건강 분석
            </h1>
          </div>
          <Link
            to={`/my/pets/${data.petId}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
          >
            상세정보 보기
          </Link>
        </div>

        <HealthAnalysisCreateForm petId={data.petId} />

        <HealthAnalysisListSection petId={data.petId} petName={data.petName} />
      </div>
    );
  }

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey="pet-list"
        />
      }
      content={content}
    />
  );
}
