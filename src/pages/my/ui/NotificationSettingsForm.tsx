import { useEffect, useRef, useState } from 'react';

import { updateNotificationSetting } from '@/features/auth/api/auth';
import { NOTIFICATION_SETTING_STATUS_MESSAGES } from '@/features/auth/lib/apiErrorMessages';
import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { setNotificationEnabled, syncUserProfile } from '@/shared/lib/auth/token';
import { Skeleton, Toast } from '@/shared/ui';

/** 설정 변경 직후 연타로 계속 뒤집는 것을 막기 위한 쿨다운 */
const CHANGE_COOLDOWN_MS = 10_000;

export function NotificationSettingsForm() {
  const { user, notificationEnabled, isLoading } = useCurrentUser();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current !== null) {
        window.clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      setEnabled(user.notificationEnabled);
      return;
    }

    if (!isLoading && notificationEnabled !== null) {
      setEnabled(notificationEnabled);
    }
  }, [user, notificationEnabled, isLoading]);

  const handleChange = async (next: boolean) => {
    setSaving(true);
    setError('');

    try {
      await updateNotificationSetting(next);
      setNotificationEnabled(next);
      syncUserProfile({ notificationEnabled: next });
      setEnabled(next);
      setToastOpen(true);

      setIsCoolingDown(true);
      cooldownTimerRef.current = window.setTimeout(() => {
        setIsCoolingDown(false);
      }, CHANGE_COOLDOWN_MS);
    } catch (changeError) {
      console.error('[notification-setting] failed', changeError);
      setError(
        getApiErrorMessage(
          changeError,
          '알림 설정 변경에 실패했어요. 잠시 후 다시 시도해 주세요.',
          NOTIFICATION_SETTING_STATUS_MESSAGES,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <NotificationChoiceSkeleton />
        <NotificationChoiceSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <ChoiceCard
          title="알림 받기"
          description="산책, 건강, 가족 관리 등 주요 알림을 계속 받아볼 수 있어요."
          selected={enabled === true}
          disabled={saving || isCoolingDown}
          onClick={() => void handleChange(true)}
        />
        <ChoiceCard
          title="지금은 받지 않기"
          description="필수 공지를 제외하고 알림 수신을 잠시 멈출 수 있어요."
          selected={enabled === false}
          disabled={saving || isCoolingDown}
          onClick={() => void handleChange(false)}
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Toast open={toastOpen} message="알림 설정이 변경되었어요." onClose={() => setToastOpen(false)} />
    </div>
  );
}

function NotificationChoiceSkeleton() {
  return (
    <div className="w-full rounded-[20px] border border-neutral-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-start gap-4">
        <Skeleton className="mt-0.5 h-5 w-5 rounded-full" />

        <div className="flex-1">
          <Skeleton className="h-5 w-28 rounded-md" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-8/12 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChoiceCardProps {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ChoiceCard({ title, description, selected, disabled = false, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full rounded-[20px] border bg-white px-5 py-5 text-left shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60',
        selected ? 'border-brand ring-1 ring-brand' : 'border-neutral-200 hover:border-brand/50',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <span
          className={[
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white transition-colors',
            selected ? 'bg-brand' : 'bg-neutral-300',
          ].join(' ')}
          aria-hidden
        >
          ✓
        </span>

        <div>
          <p className="text-base font-semibold text-neutral-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
        </div>
      </div>
    </button>
  );
}
