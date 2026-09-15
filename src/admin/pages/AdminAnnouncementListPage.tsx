import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAnnouncementList } from '@/admin/features/announcement/model/useAnnouncementList';

const PAGE_SIZE = 20;

export function AdminAnnouncementListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useAnnouncementList({ page, size: PAGE_SIZE });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">공지사항 관리</h1>
        <Link
          to="/announcements/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          새 공지 작성
        </Link>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">공지 목록을 불러오지 못했습니다.</p>}
      {data && data.data.length === 0 && <p className="text-sm text-neutral-500">등록된 공지가 없습니다.</p>}

      {data && data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium">조회수</th>
                <th className="px-4 py-3 font-medium">작성일</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => (
                <tr
                  key={item.boardId}
                  onClick={() => navigate(`/announcements/${item.boardId}`)}
                  className="cursor-pointer border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                >
                  <td className="max-w-[360px] truncate px-4 py-3">{item.boardTitle}</td>
                  <td className="px-4 py-3">{item.viewCount}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(item.boardCreatedAt).toLocaleString('ko-KR')}
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
