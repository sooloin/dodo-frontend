import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import {
  NOTIFICATION_LIST_STATUS_MESSAGES,
  NOTIFICATION_MUTATION_STATUS_MESSAGES,
  NOTIFICATION_TYPE_LABELS,
  useDeleteAllNotifications,
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useNotificationList,
  useUpdateNotificationReadState,
  type NotificationItem,
} from '@/features/notification';
import { getMyDodoMenuKeyByPathname } from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { NotificationSettingsModal } from '@/pages/my/ui/NotificationSettingsModal';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { Skeleton } from '@/shared/ui';

const PAGE_SIZE = 20;

const COPY = {
  eyebrow: 'NOTICE',
  title: '알림함',
  settingsLink: '알림 설정',
  unreadOnly: '안읽음만',
  markAllRead: '모두 읽음',
  deleteAll: '전체 삭제',
  deleteAllConfirm: '모든 알림을 삭제할까요? 삭제 후에는 복구할 수 없어요.',
  deleteConfirm: '이 알림을 삭제할까요?',
  empty: '아직 도착한 알림이 없어요.',
  loadFailed: '알림을 불러오지 못했어요.',
  retry: '다시 시도',
  previousPage: '이전',
  nextPage: '다음',
  delete: '삭제',
};

function resolveNotificationLink(item: NotificationItem): string | null {
  switch (item.notificationType) {
    case 'BOARD':
    case 'COMMENT':
    case 'REACTION':
      // 댓글/반응 알림도 relatedId가 소속 게시글 ID로 내려온다는 전제로 게시글 상세로 연결
      return `/community/${item.relatedId}`;
    case 'PET':
      return `/my/pets/${item.relatedId}`;
    default:
      return null;
  }
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function NotificationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey = getMyDodoMenuKeyByPathname(location.pathname);
  const { user, isLoading: isUserLoading, profileUrl, displayName } = useCurrentUser();
  const [page, setPage] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [actionError, setActionError] = useState('');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useNotificationList({
    page,
    size: PAGE_SIZE,
    isRead: unreadOnly ? false : undefined,
  });

  const { mutate: updateReadState } = useUpdateNotificationReadState();
  const { mutateAsync: markAllRead, isPending: isMarkingAllRead } = useMarkAllNotificationsRead();
  const { mutateAsync: removeNotification } = useDeleteNotification();
  const { mutateAsync: removeAllNotifications, isPending: isDeletingAll } = useDeleteAllNotifications();

  const notifications = data?.data ?? [];
  const pageInfo = data?.pageInfo;

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      updateReadState({ notificationId: item.notificationId, isRead: true });
    }

    const link = resolveNotificationLink(item);
    if (link) {
      navigate(link);
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (!window.confirm(COPY.deleteConfirm)) return;

    setActionError('');
    try {
      await removeNotification(notificationId);
    } catch (deleteError) {
      setActionError(
        getApiErrorMessage(deleteError, '알림을 삭제하지 못했어요.', NOTIFICATION_MUTATION_STATUS_MESSAGES),
      );
    }
  };

  const handleMarkAllRead = async () => {
    setActionError('');
    try {
      await markAllRead();
    } catch (markError) {
      setActionError(
        getApiErrorMessage(markError, '모든 알림을 읽음 처리하지 못했어요.', NOTIFICATION_MUTATION_STATUS_MESSAGES),
      );
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(COPY.deleteAllConfirm)) return;

    setActionError('');
    try {
      await removeAllNotifications();
      setPage(0);
    } catch (deleteError) {
      setActionError(
        getApiErrorMessage(deleteError, '알림을 전체 삭제하지 못했어요.', NOTIFICATION_MUTATION_STATUS_MESSAGES),
      );
    }
  };

  return (
    <>
      <MyDodoLayout
        sidebar={
          <MyDodoSidebarPanel
            user={user}
            profileUrl={profileUrl}
            displayName={displayName}
            isLoading={isUserLoading}
            activeKey={activeKey}
          />
        }
        content={
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-brand">{COPY.eyebrow}</p>
                <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">{COPY.title}</h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUnreadOnly((prev) => !prev);
                      setPage(0);
                    }}
                    aria-pressed={unreadOnly}
                    className={[
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      unreadOnly
                        ? 'border-brand bg-brand/10 text-neutral-900'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
                    ].join(' ')}
                  >
                    {COPY.unreadOnly}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleMarkAllRead()}
                    disabled={isMarkingAllRead}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {COPY.markAllRead}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteAll()}
                    disabled={isDeletingAll}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {COPY.deleteAll}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                aria-label={COPY.settingsLink}
                title={COPY.settingsLink}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700"
              >
                <SettingsIcon className="h-4.5 w-4.5" />
              </button>
            </div>

            {actionError ? <p className="text-sm text-red-500">{actionError}</p> : null}

            {isLoading ? (
              <NotificationListSkeleton />
            ) : isError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 text-center">
                <p className="text-sm text-red-500">
                  {getApiErrorMessage(error, COPY.loadFailed, NOTIFICATION_LIST_STATUS_MESSAGES)}
                </p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                >
                  {COPY.retry}
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">
                {COPY.empty}
              </div>
            ) : (
              <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                {notifications.map((item) => (
                  <li key={item.notificationId} className="flex items-start gap-3 px-5 py-4">
                    <button type="button" onClick={() => handleItemClick(item)} className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        {!item.isRead ? <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden /> : null}
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
                          {NOTIFICATION_TYPE_LABELS[item.notificationType]}
                        </span>
                        <p
                          className={[
                            'truncate text-sm',
                            item.isRead ? 'text-neutral-600' : 'font-semibold text-neutral-900',
                          ].join(' ')}
                        >
                          {item.notificationTitle}
                        </p>
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-neutral-500">{item.notificationBody}</p>
                      <p className="mt-1.5 text-xs text-neutral-400">{formatDateTime(item.createdAt)}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(item.notificationId)}
                      className="shrink-0 rounded-full px-2 py-1 text-xs text-neutral-400 transition-colors hover:text-red-500"
                    >
                      {COPY.delete}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {pageInfo && pageInfo.totalPages > 1 ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={pageInfo.page <= 0}
                  onClick={() => setPage(pageInfo.page - 1)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {COPY.previousPage}
                </button>
                <span className="text-sm text-neutral-500">
                  {pageInfo.page + 1} / {pageInfo.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pageInfo.page >= pageInfo.totalPages - 1}
                  onClick={() => setPage(pageInfo.page + 1)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {COPY.nextPage}
                </button>
              </div>
            ) : null}
          </div>
        }
      />

      <NotificationSettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </>
  );
}

function NotificationListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="mt-3 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-3 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M19.4 13.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4.5a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10.5a1.65 1.65 0 0 0 1-1.51V4.5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10.5a1.65 1.65 0 0 0 1.51 1H19.5a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
