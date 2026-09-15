import { useState } from 'react';

import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import {
  formatActivityStatusLabel,
  formatActivityTypeLabel,
  formatDateTimeLabel,
  formatDistanceLabel,
  formatDurationLabel,
} from '../lib/formatters';
import { useActivityHistoryDetail } from '../model/useActivityHistoryDetail';
import { useActivityHistoryList } from '../model/useActivityHistoryList';

const PAGE_SIZE = 10;

function ActivityDetailPanel({ historyId }: { historyId: number }) {
  const { data, isLoading, isError } = useActivityHistoryDetail(historyId);

  if (isLoading) {
    return <p className="px-4 py-3 text-sm text-neutral-500">상세 정보를 불러오는 중이에요...</p>;
  }

  if (isError || !data) {
    return <p className="px-4 py-3 text-sm text-red-500">상세 정보를 불러오지 못했어요.</p>;
  }

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-neutral-100 px-4 py-3.5 text-sm">
      <div>
        <dt className="text-xs text-neutral-400">시작 시각</dt>
        <dd className="mt-0.5 text-neutral-800">{formatDateTimeLabel(data.activityHistoryStartAt)}</dd>
      </div>
      <div>
        <dt className="text-xs text-neutral-400">종료 시각</dt>
        <dd className="mt-0.5 text-neutral-800">{formatDateTimeLabel(data.activityHistoryEndAt)}</dd>
      </div>
      <div>
        <dt className="text-xs text-neutral-400">시작 위치</dt>
        <dd className="mt-0.5 text-neutral-800">
          {data.startLatitude.toFixed(5)}, {data.startLongitude.toFixed(5)}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-neutral-400">반응</dt>
        <dd className="mt-0.5 text-neutral-800">
          {data.reactionCount}개{data.isLikedByMe ? ' · 내가 좋아요 누름' : ''}
        </dd>
      </div>
    </dl>
  );
}

interface ActivityHistoryListProps {
  /** 'all'이면 전체, 숫자면 해당 반려동물의 기록만 (클라이언트에서 필터 — 목록 API가 petId 필터를 지원하지 않음) */
  petId: number | 'all';
  emptyMessage?: string;
}

export function ActivityHistoryList({
  petId,
  emptyMessage = '아직 기록된 산책이 없습니다.',
}: ActivityHistoryListProps) {
  const [loadedSize, setLoadedSize] = useState(PAGE_SIZE);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data, isLoading, isError, error, refetch } = useActivityHistoryList({
    page: 0,
    size: loadedSize,
    sort: 'activityHistoryStartAt,desc',
  });

  const allHistories = data?.histories ?? [];
  const histories = petId === 'all' ? allHistories : allHistories.filter((item) => item.pet.id === petId);
  const hasMore = (data?.totalElements ?? 0) > allHistories.length;

  if (isLoading) {
    return <p className="text-sm text-neutral-500">산책 기록을 불러오는 중이에요...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-4">
        <p className="text-sm text-red-600">{getApiErrorMessage(error, '산책 기록을 불러오지 못했어요.')}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <article className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
        <p className="text-sm leading-6 text-neutral-600">{emptyMessage}</p>
      </article>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="space-y-2.5">
        {histories.map((item) => (
          <article key={item.historyId} className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setExpandedId((prev) => (prev === item.historyId ? null : item.historyId))}
              className="flex w-full flex-col gap-3 px-4 py-3.5 text-left lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {item.pet.profileImageUrl ? (
                  <img src={item.pet.profileImageUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100" aria-hidden />
                )}
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-neutral-900">
                    {item.pet.name}와(과) {formatDistanceLabel(item.distance)}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatDurationLabel(item.activityHistoryStartAt, item.activityHistoryEndAt)} · 반응{' '}
                    {item.reactionCount}개{item.heartAverage ? ` · 평균 심박수 ${item.heartAverage}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{formatDateTimeLabel(item.activityHistoryStartAt)}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                      {formatActivityTypeLabel(item.activityType)}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                      {formatActivityStatusLabel(item.activityHistoryStatus)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="shrink-0 text-sm text-neutral-400">
                {expandedId === item.historyId ? '접기' : '상세보기'}
              </span>
            </button>

            {expandedId === item.historyId && <ActivityDetailPanel historyId={item.historyId} />}
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setLoadedSize((prev) => prev + PAGE_SIZE)}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
