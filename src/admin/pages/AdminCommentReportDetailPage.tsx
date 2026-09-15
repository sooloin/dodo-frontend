import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { REPORT_REASON_LABELS } from '@/admin/features/report/lib/constants';
import { truncateNickname } from '@/admin/features/report/lib/format';
import { ForceDeleteDialog } from '@/admin/features/report/ui/ForceDeleteDialog';
import { useCommentReportDetail } from '@/admin/features/report/model/useCommentReportDetail';
import { useForceDeleteComment } from '@/admin/features/report/model/useForceDeleteComment';
import { useUpdateReportStatus } from '@/admin/features/report/model/useUpdateReportStatus';

export function AdminCommentReportDetailPage() {
  const { commentId } = useParams<{ commentId: string }>();
  const navigate = useNavigate();
  const numericCommentId = Number(commentId);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useCommentReportDetail(numericCommentId);
  const updateStatus = useUpdateReportStatus();
  const forceDelete = useForceDeleteComment();

  const handleDeleteConfirm = () => {
    forceDelete.mutate(numericCommentId, {
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
              <p className="text-xs text-neutral-400">댓글 #{data.commentId}</p>
              <p className="whitespace-pre-wrap text-sm text-neutral-800">{data.commentContent}</p>
              <p className="text-xs text-neutral-400" title={data.reportedNickname ?? undefined}>
                작성자 {data.reportedNickname ? truncateNickname(data.reportedNickname) : '알 수 없음'} · 신고{' '}
                {data.totalReportCount}건
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              댓글 강제삭제
            </button>
          </div>

          {/* 댓글 신고 상세 응답에는 개별 신고의 처리 상태(reportStatus)가 내려오지 않아 토글 대신 완료 처리 버튼만 제공 */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-medium">신고자</th>
                  <th className="px-4 py-3 font-medium">사유</th>
                  <th className="px-4 py-3 font-medium">신고일</th>
                  <th className="px-4 py-3 font-medium">처리</th>
                </tr>
              </thead>
              <tbody>
                {data.reports.map((report) => (
                  <tr key={report.reportId} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3" title={report.reporterNickname ?? undefined}>
                      {report.reporterNickname ? truncateNickname(report.reporterNickname) : '알 수 없음'}
                    </td>
                    <td className="px-4 py-3">{REPORT_REASON_LABELS[report.reportReason]}</td>
                    <td className="px-4 py-3 text-neutral-500">
                      {new Date(report.reportCreatedAt).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ reportId: report.reportId, status: 'COMPLETED' })}
                        className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-neutral-100 disabled:opacity-40"
                      >
                        완료 처리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ForceDeleteDialog
        open={isDeleteOpen}
        isPending={forceDelete.isPending}
        targetLabel="댓글"
        errorMessage={forceDelete.isError ? '삭제에 실패했습니다. 잠시 후 다시 시도해주세요.' : undefined}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
