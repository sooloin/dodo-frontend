import { useState } from 'react';

import { usePetList } from '@/features/auth';

import { ActivityHistoryList } from './ActivityHistoryList';
import { PetFilterSelect } from './PetFilterSelect';

export function WalkHistoryContent() {
  const { data: petListData } = usePetList();
  const pets = petListData?.pets ?? [];
  const [selectedPetId, setSelectedPetId] = useState<number | 'all'>('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">WALK HISTORY</p>
          <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">산책 기록</h1>
        </div>

        {pets.length > 0 && <PetFilterSelect pets={pets} selectedPetId={selectedPetId} onSelect={setSelectedPetId} />}
      </div>

      <ActivityHistoryList petId={selectedPetId} />
    </div>
  );
}
