interface PetFilterSelectProps {
  pets: { petId: number; petName: string }[];
  selectedPetId: number | 'all';
  onSelect: (petId: number | 'all') => void;
  className?: string;
}

export function PetFilterSelect({ pets, selectedPetId, onSelect, className = '' }: PetFilterSelectProps) {
  return (
    <select
      value={selectedPetId}
      onChange={(event) => onSelect(event.target.value === 'all' ? 'all' : Number(event.target.value))}
      className={`h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition-colors focus:border-brand ${className}`}
    >
      <option value="all">전체</option>
      {pets.map((pet) => (
        <option key={pet.petId} value={pet.petId}>
          {pet.petName}
        </option>
      ))}
    </select>
  );
}
