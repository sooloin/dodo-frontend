import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { truncateNickname } from '@/admin/features/report/lib/format';
import { ForceDeleteDialog } from '@/admin/features/report/ui/ForceDeleteDialog';
import { ReportRecordTable } from '@/admin/features/report/ui/ReportRecordTable';
import { useBoardReportDetail } from '@/admin/features/report/model/useBoardReportDetail';
import { useForceDeleteBoard } from '@/admin/features/report/model/useForceDeleteBoard';
import { useUpdateReportStatus } from '@/admin/features/report/model/useUpdateReportStatus';

export function AdminBoardReportDetailPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const numericBoardId = Number(boardId);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useBoardReportDetail(numericBoardId);
  const updateStatus = useUpdateReportStatus();
  const forceDelete = useForceDeleteBoard();

  const handleDeleteConfirm = () => {
    forceDelete.mutate(numericBoardId, {
      onSuccess: () => navigate('/reports', { replace: true }),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Link to="/reports" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← 신고 목록으로
      </Link>

      {isLoading && <p className="text-sm text-neutral-500">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">신고 상세를 불러오지 못했습니다.</p>}

      {data && (
        <>
          <div className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-400">게시글 #{data.boardId}</p>
              <h1 className="text-lg font-semibold text-neutral-900">{data.boardInfo.boardTitle}</h1>
              <p className="whitespace-pre-wrap text-sm text-neutral-600">{data.boardInfo.boardContent}</p>
              <p className="text-xs text-neutral-400">
                작성자{' '}
                <span className="font-medium text-neutral-600" title={data.reportedUserInfo.nickname}>
                  {truncateNickname(data.reportedUserInfo.nickname)}
                </span>{' '}
                · {new Date(data.boardInfo.boardCreatedAt).toLocaleString('ko-KR')} · 신고 {data.totalReportCount}건
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              게시글 강제삭제
            </button>
          </div>

          <ReportRecordTable
            rows={data.reports.map((report) => ({
              reportId: report.reportId,
              reporterLabel: report.reporterInfo.nickname,
              reportReason: report.reportReason,
              reportStatus: report.reportStatus,
              reportCreatedAt: report.reportCreatedAt,
            }))}
            isToggling={updateStatus.isPending}
            onToggleStatus={(reportId, nextStatus) => updateStatus.mutate({ reportId, status: nextStatus })}
          />
        </>
      )}

      <ForceDeleteDialog
        open={isDeleteOpen}
        isPending={forceDelete.isPending}
        targetLabel="게시글"
        errorMessage={forceDelete.isError ? '삭제에 실패했습니다. 잠시 후 다시 시도해주세요.' : undefined}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
