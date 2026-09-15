import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '@/admin/features/report/lib/constants';
import { truncateNickname } from '@/admin/features/report/lib/format';
import type { AdminReportStatus } from '@/admin/features/report/model/types';
import type { ReportReason } from '@/features/report/model/types';

export interface ReportRecordRow {
  reportId: number;
  reporterLabel: string;
  reportReason: ReportReason;
  /** 상태 정보가 응답에 없으면 undefined — 이 경우 토글 대신 '완료 처리' 버튼만 노출 */
  reportStatus?: AdminReportStatus;
  reportCreatedAt: string;
}

interface ReportRecordTableProps {
  rows: ReportRecordRow[];
  onToggleStatus: (reportId: number, nextStatus: AdminReportStatus) => void;
  isToggling: boolean;
}

export function ReportRecordTable({ rows, onToggleStatus, isToggling }: ReportRecordTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
          <tr>
            <th className="px-4 py-3 font-medium">신고자</th>
            <th className="px-4 py-3 font-medium">사유</th>
            <th className="px-4 py-3 font-medium">신고일</th>
            <th className="px-4 py-3 font-medium">상태</th>
            <th className="px-4 py-3 font-medium">처리</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.reportId} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3" title={row.reporterLabel}>
                {truncateNickname(row.reporterLabel)}
              </td>
              <td className="px-4 py-3">{REPORT_REASON_LABELS[row.reportReason]}</td>
              <td className="px-4 py-3 text-neutral-500">{new Date(row.reportCreatedAt).toLocaleString('ko-KR')}</td>
              <td className="px-4 py-3">
                {row.reportStatus ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.reportStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {REPORT_STATUS_LABELS[row.reportStatus]}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400">알 수 없음</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={isToggling}
                  onClick={() =>
                    onToggleStatus(row.reportId, row.reportStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED')
                  }
                  className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-neutral-100 disabled:opacity-40"
                >
                  {row.reportStatus === 'COMPLETED' ? '대기로 되돌리기' : '완료 처리'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
