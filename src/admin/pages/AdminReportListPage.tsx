import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS, REPORT_TYPE_LABELS } from '@/admin/features/report/lib/constants';
import { truncateNickname } from '@/admin/features/report/lib/format';
import { useAdminReportList } from '@/admin/features/report/model/useAdminReportList';
import type { AdminReportStatus, AdminReportType } from '@/admin/features/report/model/types';

const REPORT_TYPE_TABS: AdminReportType[] = ['BOARD', 'COMMENT'];
const PAGE_SIZE = 20;

function tabClassName(active: boolean): string {
  return `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    active ? 'bg-brand text-brand-foreground' : 'text-neutral-500 hover:bg-neutral-100'
  }`;
}

function detailPath(reportType: AdminReportType, targetId: string): string {
  return reportType === 'BOARD' ? `/reports/board/${targetId}` : `/reports/comment/${targetId}`;
}

export function AdminReportListPage() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<AdminReportType>('BOARD');
  const [reportStatus, setReportStatus] = useState<AdminReportStatus | ''>('PENDING');
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useAdminReportList({
    reportType,
    reportStatus: reportStatus || undefined,
    page,
    size: PAGE_SIZE,
  });

  const handleChangeType = (type: AdminReportType) => {
    setReportType(type);
    setPage(0);
  };

  const handleChangeStatus = (status: AdminReportStatus | '') => {
    setReportStatus(status);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">신고 관리</h1>
        <select
          value={reportStatus}
          onChange={(event) => handleChangeStatus(event.target.value as AdminReportStatus | '')}
          className="h-9 rounded-lg border border-neutral-300 px-3 text-sm"
        >
          <option value="">전체 상태</option>
          <option value="PENDING">처리 대기</option>
          <option value="COMPLETED">처리 완료</option>
        </select>
      </div>

      <div className="flex gap-1 border-b border-neutral-200 pb-1">
        {REPORT_TYPE_TABS.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleChangeType(type)}
            className={tabClassName(reportType === type)}
          >
            {REPORT_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-neutral-500">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">신고 목록을 불러오지 못했습니다.</p>}

      {data && data.data.length === 0 && <p className="text-sm text-neutral-500">해당 조건의 신고가 없습니다.</p>}

      {data && data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">대상</th>
                <th className="px-4 py-3 font-medium">신고 대상 유저</th>
                <th className="px-4 py-3 font-medium">신고 건수</th>
                <th className="px-4 py-3 font-medium">대표 사유</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">최근 신고일</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => (
                <tr
                  key={`${item.reportType}-${item.targetInfo.id}`}
                  onClick={() => navigate(detailPath(item.reportType, item.targetInfo.id))}
                  className="cursor-pointer border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                >
                  <td className="max-w-[240px] truncate px-4 py-3">{item.targetInfo.summary}</td>
                  <td className="px-4 py-3" title={item.reportedUser.nickname}>
                    {truncateNickname(item.reportedUser.nickname)}
                  </td>
                  <td className="px-4 py-3">{item.totalReportCount}건</td>
                  <td className="px-4 py-3">{REPORT_REASON_LABELS[item.representativeReason]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.reportStatus === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {REPORT_STATUS_LABELS[item.reportStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(item.lastReportedAt).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-sm text-neutral-500">
            {page + 1} / {data.pageInfo.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= data.pageInfo.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
