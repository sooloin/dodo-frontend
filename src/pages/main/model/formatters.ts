const SPECIES_LABEL: Record<string, string> = {
  CANINE: '강아지',
  FELINE: '고양이',
};

export function getMainPetSpecies(profile: { species?: string; spercies?: string }) {
  return profile.species ?? profile.spercies ?? '';
}

export function formatSpeciesLabel(species: string) {
  return SPECIES_LABEL[species] ?? species;
}

export function formatWeightLabel(weight: number) {
  if (!Number.isFinite(weight)) return '-';
  if (Number.isInteger(weight)) return `${weight} kg`;
  return `${weight.toFixed(1)} kg`;
}

export function formatDateLabel(value: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getLatestReportByPet<T extends { petId: number; checkupDate: string }>(
  petId: number,
  reports: T[],
): T | undefined {
  let latest: T | undefined;
  let latestTime = -1;

  for (const report of reports) {
    if (report.petId !== petId) {
      continue;
    }

    const time = new Date(report.checkupDate).getTime();
    if (!Number.isNaN(time) && time > latestTime) {
      latestTime = time;
      latest = report;
    }
  }

  return latest;
}
