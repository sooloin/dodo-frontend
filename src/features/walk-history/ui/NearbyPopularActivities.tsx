import { formatActivityTypeLabel, formatDateTimeLabel, formatDistanceLabel } from '../lib/formatters';
import { useCurrentPosition } from '../model/useCurrentPosition';
import { useNearbyPopularActivities } from '../model/useNearbyPopularActivities';

export function NearbyPopularActivities() {
  const { latitude, longitude, status, errorMessage } = useCurrentPosition();
  const { data, isLoading, isError } = useNearbyPopularActivities({ latitude, longitude, limit: 10 });

  if (status === 'loading') {
    return <p className="text-sm text-neutral-500">내 위치를 확인하는 중이에요...</p>;
  }

  if (status === 'error') {
    return (
      <article className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
        <p className="text-sm leading-6 text-neutral-600">{errorMessage}</p>
      </article>
    );
  }

  const activities = data?.histories ?? [];

  return (
    <div className="space-y-2.5">
      {isLoading ? (
        <p className="text-sm text-neutral-500">주변 인기 활동을 불러오는 중이에요...</p>
      ) : isError ? (
        <article className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">주변 인기 활동을 불러오지 못했어요.</p>
        </article>
      ) : activities.length === 0 ? (
        <article className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-neutral-600">주변에 인기 활동이 아직 없어요.</p>
        </article>
      ) : (
        <div className="space-y-2">
          {activities.map((item) => (
            <article
              key={item.historyId}
              className="flex items-center gap-3 rounded-[14px] border border-neutral-200 bg-white px-3.5 py-3"
            >
              {item.pet.profileImageUrl ? (
                <img src={item.pet.profileImageUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-100" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {item.pet.name} · {formatActivityTypeLabel(item.activityType)} {formatDistanceLabel(item.distance)}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {formatDateTimeLabel(item.activityHistoryStartAt)} · 좋아요 {item.reactionCount}개
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
