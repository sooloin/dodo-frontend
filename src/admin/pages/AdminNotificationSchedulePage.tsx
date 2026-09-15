import { useState, type FormEvent } from 'react';

import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_OPTIONS,
  REPEAT_TYPE_LABELS,
  REPEAT_TYPE_OPTIONS,
  TARGET_TYPE_LABELS,
  TARGET_TYPE_OPTIONS,
} from '@/admin/features/notification-schedule/lib/constants';
import { useCreateNotificationSchedule } from '@/admin/features/notification-schedule/model/useCreateNotificationSchedule';
import type {
  NotificationScheduleRepeatType,
  NotificationScheduleTargetType,
  NotificationScheduleType,
} from '@/admin/features/notification-schedule/model/types';

function parseTargetUserIds(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function AdminNotificationSchedulePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationScheduleType>('SYSTEM');
  const [targetType, setTargetType] = useState<NotificationScheduleTargetType>('ALL');
  const [targetUserIdsInput, setTargetUserIdsInput] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [repeatType, setRepeatType] = useState<NotificationScheduleRepeatType>('NONE');

  const { mutate, isPending, isError, data } = useCreateNotificationSchedule();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const targetUserIds = targetType === 'USERS' ? parseTargetUserIds(targetUserIdsInput) : undefined;
    if (targetType === 'USERS' && (!targetUserIds || targetUserIds.length === 0)) return;

    mutate({
      title,
      body,
      notificationType,
      targetType,
      targetUserIds,
      scheduledAt,
      repeatType,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold text-neutral-900">알림 스케줄 등록</h1>
      <p className="text-xs text-neutral-400">
        조회·취소 API가 아직 없어서 등록만 가능해요. 등록 후 결과는 아래에서만 확인할 수 있어요.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6"
      >
        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          제목
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={255}
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          내용
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            rows={4}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
            알림 유형
            <select
              value={notificationType}
              onChange={(event) => setNotificationType(event.target.value as NotificationScheduleType)}
              className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
            >
              {NOTIFICATION_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {NOTIFICATION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-1 flex-col gap-1 text-sm text-neutral-700">
            반복
            <select
              value={repeatType}
              onChange={(event) => setRepeatType(event.target.value as NotificationScheduleRepeatType)}
              className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
            >
              {REPEAT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {REPEAT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          발송 대상
          <select
            value={targetType}
            onChange={(event) => setTargetType(event.target.value as NotificationScheduleTargetType)}
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
          >
            {TARGET_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {TARGET_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        {targetType === 'USERS' && (
          <label className="flex flex-col gap-1 text-sm text-neutral-700">
            대상 유저 ID (UUID, 줄바꿈 또는 콤마로 구분)
            <textarea
              value={targetUserIdsInput}
              onChange={(event) => setTargetUserIdsInput(event.target.value)}
              rows={3}
              placeholder={'3eb3581d-b046-11f1-bae4-7085c2970281'}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          예약 발송 시간
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            required
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
          />
        </label>

        {isError && <p className="text-sm text-red-500">등록에 실패했습니다. 잠시 후 다시 시도해주세요.</p>}

        <button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-lg bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? '등록 중...' : '등록하기'}
        </button>
      </form>

      {data && (
        <div className="mx-auto w-full max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p>{data.message}</p>
          <p className="mt-1 text-xs text-emerald-700">
            스케줄 ID {data.scheduleId} · 상태 {data.scheduleStatus} ·{' '}
            {new Date(data.scheduledAt).toLocaleString('ko-KR')} 발송 예정
          </p>
        </div>
      )}
    </div>
  );
}
