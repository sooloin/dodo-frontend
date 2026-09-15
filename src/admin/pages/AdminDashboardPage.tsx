import { Link } from 'react-router-dom';

import { useAdminReportList } from '@/admin/features/report/model/useAdminReportList';

const SECTIONS = [
  { to: '/reports', title: '신고 관리', description: '게시글·댓글 신고를 확인하고 처리해요' },
  { to: '/announcements', title: '공지사항 관리', description: '공지를 작성하고 관리해요' },
  { to: '/users', title: '유저 관리', description: '유저를 검색하고 상태를 변경해요' },
  { to: '/notification-schedules', title: '알림 스케줄', description: '예약 알림을 등록해요' },
];

export function AdminDashboardPage() {
  const boardPending = useAdminReportList({ reportType: 'BOARD', reportStatus: 'PENDING', page: 0, size: 1 });
  const commentPending = useAdminReportList({ reportType: 'COMMENT', reportStatus: 'PENDING', page: 0, size: 1 });

  const pendingCount =
    (boardPending.data?.pageInfo.totalElements ?? 0) + (commentPending.data?.pageInfo.totalElements ?? 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">관리자 대시보드</h1>
        {pendingCount > 0 && (
          <p className="mt-1 text-sm text-amber-700">
            처리 대기 중인 신고가{' '}
            <Link to="/reports" className="font-semibold underline-offset-2 hover:underline">
              {pendingCount}건
            </Link>{' '}
            있어요.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300"
          >
            <h2 className="text-base font-semibold text-neutral-900">{section.title}</h2>
            <p className="text-sm text-neutral-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
