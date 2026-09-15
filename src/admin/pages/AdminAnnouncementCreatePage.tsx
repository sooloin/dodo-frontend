import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { NOTICE_TAG_LABELS } from '@/admin/features/announcement/lib/constants';
import { useCreateAnnouncement } from '@/admin/features/announcement/model/useCreateAnnouncement';
import type { NoticeTag } from '@/admin/features/announcement/model/types';

const NOTICE_TAGS: NoticeTag[] = ['INFO', 'URGENT'];

export function AdminAnnouncementCreatePage() {
  const navigate = useNavigate();
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [noticeTag, setNoticeTag] = useState<NoticeTag>('INFO');
  const { mutate, isPending, isError } = useCreateAnnouncement();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      {
        boardTitle,
        boardContent,
        imageFileUrl: imageFileUrl.trim() || undefined,
        noticeTag,
      },
      {
        onSuccess: () => navigate('/announcements', { replace: true }),
      },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <Link to="/announcements" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← 공지 목록으로
      </Link>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6"
      >
        <h1 className="text-lg font-semibold text-neutral-900">새 공지 작성</h1>

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
          이미지 URL (선택)
          <input
            value={imageFileUrl}
            onChange={(event) => setImageFileUrl(event.target.value)}
            placeholder="https://..."
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          태그
          <select
            value={noticeTag}
            onChange={(event) => setNoticeTag(event.target.value as NoticeTag)}
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm"
          >
            {NOTICE_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {NOTICE_TAG_LABELS[tag]}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-neutral-400">태그는 작성 시에만 지정할 수 있고, 이후에는 수정할 수 없어요.</p>

        {isError && <p className="text-sm text-red-500">등록에 실패했습니다. 잠시 후 다시 시도해주세요.</p>}

        <button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-lg bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  );
}
