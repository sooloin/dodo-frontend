import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { usePetList } from '@/features/auth';
import {
  FamilyManagementEmptyState,
  FamilyManagementErrorState,
  FamilyManagementLoadingState,
  FamilyPetSelector,
} from '@/features/family-management';

import { HealthAnalysisCreateForm } from './HealthAnalysisCreateForm';
import { HealthAnalysisListSection } from './HealthAnalysisListSection';

export function HealthAnalysisManagementContent() {
  const [searchParams] = useSearchParams();
  const selectedPetIdParam = searchParams.get('petId');
  const initialSelectedPetId =
    selectedPetIdParam && !Number.isNaN(Number(selectedPetIdParam)) ? Number(selectedPetIdParam) : null;

  const { data, isLoading, isError, refetch } = usePetList({ page: 0, size: 10 });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(initialSelectedPetId);

  const pets = data?.pets ?? [];
  const selectedPet = (selectedPetId ? pets.find((pet) => pet.petId === selectedPetId) : null) ?? pets[0] ?? null;

  if (isLoading) {
    return <FamilyManagementLoadingState />;
  }

  if (isError) {
    return <FamilyManagementErrorState onRetry={() => void refetch()} />;
  }

  if (!data || pets.length === 0 || !selectedPet) {
    return <FamilyManagementEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">HEALTH ANALYSIS</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">AI 건강 분석</h1>
      </div>

      <FamilyPetSelector
        pets={pets}
        selectedPetId={selectedPet.petId}
        onSelect={setSelectedPetId}
        title="건강 분석을 확인할 반려동물을 선택해 주세요"
      />

      <HealthAnalysisCreateForm petId={selectedPet.petId} />
      <HealthAnalysisListSection petId={selectedPet.petId} petName={selectedPet.petName} />
    </div>
  );
}
