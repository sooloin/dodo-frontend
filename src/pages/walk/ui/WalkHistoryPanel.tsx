import { useState } from 'react';

import { usePetList } from '@/features/auth';
import { ActivityHistoryList, NearbyPopularActivities, PetFilterSelect } from '@/features/walk-history';

export function WalkHistoryPanel() {
  const { data: petListData } = usePetList();
  const pets = petListData?.pets ?? [];
  const [selectedPetId, setSelectedPetId] = useState<number | 'all'>('all');

  return (
    <div className="flex flex-col gap-6 px-5 py-4">
      <section className="flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-neutral-900">주변 인기 활동</h2>
        <NearbyPopularActivities />
      </section>

      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-neutral-900">반려동물별 산책 기록</h2>
          {pets.length > 0 && <PetFilterSelect pets={pets} selectedPetId={selectedPetId} onSelect={setSelectedPetId} />}
        </div>
        <ActivityHistoryList petId={selectedPetId} />
      </section>
    </div>
  );
}
