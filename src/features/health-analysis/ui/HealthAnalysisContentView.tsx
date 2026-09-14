interface HealthAnalysisStats {
  weightCount?: number;
  heartRateAvg?: number;
  activityCount?: number;
  heartRateCount?: number;
}

interface HealthAnalysisFullContentShape {
  chartData?: { stats?: HealthAnalysisStats };
  recommendations?: unknown;
}

const STAT_TILES: Array<{ key: keyof HealthAnalysisStats; label: string; unit: string }> = [
  { key: 'weightCount', label: '체중 기록', unit: '회' },
  { key: 'activityCount', label: '활동 기록', unit: '회' },
  { key: 'heartRateCount', label: '심박 기록', unit: '회' },
  { key: 'heartRateAvg', label: '평균 심박수', unit: 'bpm' },
];

function StatTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-[14px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-[20px] font-semibold text-neutral-950">
        {value}
        <span className="ml-1 text-xs font-medium text-neutral-400">{unit}</span>
      </p>
    </div>
  );
}

interface HealthAnalysisContentViewProps {
  content: Record<string, unknown>;
}

/**
 * generatedAt/analysisType은 상세 화면 상단에 이미 뱃지로 노출되어 중복이라 제외하고,
 * chartData의 원본 시리즈(weightSeries 등)는 차트 없이 숫자 배열만 보여줘봐야 의미가 없어 제외한다.
 * 사람이 읽을 만한 stats 요약과 recommendations만 골라서 보여준다.
 */
export function HealthAnalysisContentView({ content }: HealthAnalysisContentViewProps) {
  const typed = (content ?? {}) as HealthAnalysisFullContentShape;
  const stats = typed.chartData?.stats;
  const recommendations = Array.isArray(typed.recommendations)
    ? typed.recommendations.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  const statTiles = STAT_TILES.filter(({ key }) => typeof stats?.[key] === 'number');
  const hasStats = statTiles.length > 0;
  const hasRecommendations = recommendations.length > 0;

  if (!hasStats && !hasRecommendations) {
    return <p className="text-sm leading-6 text-neutral-500">아직 상세 분석 데이터가 준비되지 않았어요.</p>;
  }

  return (
    <div className="space-y-5">
      {hasStats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statTiles.map(({ key, label, unit }) => (
            <StatTile key={key} label={label} value={stats?.[key] ?? 0} unit={unit} />
          ))}
        </div>
      ) : null}

      {hasRecommendations ? (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-neutral-500">AI 추천</p>
          <ul className="list-disc space-y-1.5 pl-5">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm leading-6 text-neutral-700">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
