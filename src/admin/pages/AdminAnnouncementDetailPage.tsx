import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAnnouncementDetail } from '@/admin/features/announcement/model/useAnnouncementDetail';
import { useDeleteAnnouncement } from '@/admin/features/announcement/model/useDeleteAnnouncement';
import { useUpdateAnnouncement } from '@/admin/features/announcement/model/useUpdateAnnouncement';
import type { AnnouncementDetailResponse } from '@/admin/features/announcement/model/types';

interface AnnouncementEditFormProps {
  data: AnnouncementDetailResponse;
  onDelete: () => void;
  isDeleting: boolean;
}

function AnnouncementEditForm({ data, onDelete, isDeleting }: AnnouncementEditFormProps) {
  const [boardTitle, setBoardTitle] = useState(data.boardTitle);
  const [boardContent, setBoardContent] = useState(data.boardContent);
  const [imageFileUrl, setImageFileUrl] = useState(data.imageFileUrl ?? '');
  const updateAnnouncement = useUpdateAnnouncement();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateAnnouncement.mutate({
      boardId: data.boardId,
      body: { boardTitle, boardContent, imageFileUrl: imageFileUrl.trim() || undefined },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">공지 #{data.boardId}</h1>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      <p className="text-xs text-neutral-400">
        조회수 {data.viewCount} · 작성 {new Date(data.boardCreatedAt).toLocaleString('ko-KR')} · 수정{' '}
        {new Date(data.boardModifiedAt).toLocaleString('ko-KR')}
      </p>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        제목
        <input
          value={boardTitle}
          onChange={(event) => setBoardTitle(event.target.value)}
          required
          className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        내용
        <textarea
          value={boardContent}
          onChange={(event) => setBoardContent(event.target.value)}
          required
          rows={6}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-neutral-700">
        이미지 URL
        <input
          value={imageFileUrl}
          onChange={(event) => setImageFileUrl(event.target.value)}
          placeholder="https://..."
          className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
        />
      </label>

      {updateAnnouncement.isError && <p className="text-sm text-red-500">수정에 실패했습니다.</p>}
      {updateAnnouncement.isSuccess && <p className="text-sm text-emerald-600">수정했습니다.</p>}

      <button
        type="submit"
        disabled={updateAnnouncement.isPending}
        className="h-11 rounded-lg bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {updateAnnouncement.isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}

export function AdminAnnouncementDetailPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const numericBoardId = Number(boardId);

  const { data, isLoading, isError } = useAnnouncementDetail(numericBoardId);
  const deleteAnnouncement = useDeleteAnnouncement();

  const handleDelete = () => {
    if (!window.confirm('이 공지를 삭제할까요?')) return;

    deleteAnnouncement.mutate(numericBoardId, {
      onSuccess: () => navigate('/announcements', { replace: true }),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Link to="/announcements" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← 공지 목록으로
      </Link>

      {isLoading && <p className="text-sm text-neutral-500">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">공지를 불러오지 못했습니다.</p>}

      {data && (
        <AnnouncementEditForm
          key={data.boardId}
          data={data}
          onDelete={handleDelete}
          isDeleting={deleteAnnouncement.isPending}
        />
      )}
    </div>
  );
}
