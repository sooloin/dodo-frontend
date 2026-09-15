import { useState, type FormEvent } from 'react';

import { USER_STATUS_LABELS, USER_STATUS_OPTIONS } from '@/admin/features/user/lib/constants';
import { useAdminUserList } from '@/admin/features/user/model/useAdminUserList';
import { useUpdateUserStatus } from '@/admin/features/user/model/useUpdateUserStatus';
import type { AdminUserStatus } from '@/admin/features/user/model/types';

const PAGE_SIZE = 20;

function UserStatusCell({ userId, status }: { userId: string; status: AdminUserStatus }) {
  const [nextStatus, setNextStatus] = useState<AdminUserStatus>(status);
  const updateStatus = useUpdateUserStatus();

  return (
    <div className="flex items-center gap-2">
      <select
        value={nextStatus}
        onChange={(event) => setNextStatus(event.target.value as AdminUserStatus)}
        className="h-8 rounded-lg border border-neutral-300 px-2 text-xs"
      >
        {USER_STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {USER_STATUS_LABELS[option]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={nextStatus === status || updateStatus.isPending}
        onClick={() => updateStatus.mutate({ userId, status: nextStatus })}
        className="rounded-lg border border-neutral-300 px-2 py-1 text-xs font-medium transition-colors hover:bg-neutral-100 disabled:opacity-40"
      >
        변경
      </button>
    </div>
  );
}

export function AdminUserListPage() {
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<AdminUserStatus | ''>('');
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useAdminUserList({
    keyword: keyword || undefined,
    status: status || undefined,
    page,
    size: PAGE_SIZE,
  });

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold text-neutral-900">유저 관리</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
        <input
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="이메일, 닉네임 검색"
          className="h-9 min-w-[200px] rounded-lg border border-neutral-300 px-3 text-sm"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as AdminUserStatus | '');
            setPage(0);
          }}
          className="h-9 rounded-lg border border-neutral-300 px-3 text-sm"
        >
          <option value="">전체 상태</option>
          {USER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {USER_STATUS_LABELS[option]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 rounded-lg border border-neutral-300 px-4 text-sm font-medium transition-colors hover:bg-neutral-100"
        >
          검색
        </button>
      </form>

      {isLoading && <p className="text-sm text-neutral-500">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">유저 목록을 불러오지 못했습니다.</p>}
      {data && data.data.length === 0 && <p className="text-sm text-neutral-500">조건에 맞는 유저가 없습니다.</p>}

      {data && data.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">닉네임</th>
                <th className="px-4 py-3 font-medium">이메일</th>
                <th className="px-4 py-3 font-medium">지역</th>
                <th className="px-4 py-3 font-medium">가입일</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => (
                <tr key={user.userId} className="border-b border-neutral-100 last:border-0">
                  <td className="max-w-[140px] truncate px-4 py-3">{user.nickname}</td>
                  <td className="max-w-[200px] truncate px-4 py-3">{user.email}</td>
                  <td className="max-w-[140px] truncate px-4 py-3">{user.region}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(user.userCreatedAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <UserStatusCell userId={user.userId} status={user.status} />
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
