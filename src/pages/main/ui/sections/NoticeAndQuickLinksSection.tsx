import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Modal } from '@/shared/ui';
import type { MainAnnouncement, MainAnnouncementTag } from '@/pages/main/model/types';
import { QUICK_LINKS } from '@/pages/main/model/quickLinks';

const TAG_STYLES: Record<MainAnnouncementTag, string> = {
  INFO: 'bg-[#E8F5E9] text-[#2E7D32]',
  URGENT: 'bg-[#FFEBEE] text-[#C62828]',
};

const TAG_LABELS: Record<MainAnnouncementTag, string> = {
  INFO: '안내',
  URGENT: '긴급',
};

interface NoticeAndQuickLinksSectionProps {
  announcements: MainAnnouncement[];
}

export function NoticeAndQuickLinksSection({ announcements }: NoticeAndQuickLinksSectionProps) {
  const [selectedNotice, setSelectedNotice] = useState<MainAnnouncement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSelectNotice = (notice: MainAnnouncement) => {
    setSelectedNotice(notice);
    setIsDetailOpen(true);
  };

  return (
    <section className="w-full" aria-labelledby="home-notice-quick-heading">
      <h2 id="home-notice-quick-heading" className="sr-only">
        공지사항 및 바로가기
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-5">
        <article className="px-2 py-5 sm:px-2 sm:py-6">
          <h3 className="text-[20px] font-bold text-neutral-900">공지사항</h3>

          {announcements.length === 0 ? (
            <p className="py-2.5 text-sm text-neutral-400">등록된 공지가 없어요.</p>
          ) : (
            <ul className="mt-3 flex flex-col">
              {announcements.map((notice, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelectNotice(notice)}
                    className="flex w-full cursor-pointer items-center gap-2.5 py-2.5 text-left"
                  >
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${TAG_STYLES[notice.tag]}`}
                    >
                      {TAG_LABELS[notice.tag]}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-neutral-800">{notice.boardTitle}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="flex flex-col rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
          <h3 className="text-[20px] font-bold text-neutral-900">바로가기</h3>

          <div className="mt-4 grid flex-1 content-center grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {QUICK_LINKS.map(({ id, to, label, Icon }) => (
              <Link
                key={id}
                to={to}
                className="flex aspect-square flex-col items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-2 py-3 transition-colors hover:border-neutral-300"
              >
                <Icon className="h-20 w-20 sm:h-24 sm:w-24" />
                <span className="text-center text-[14px] font-medium text-neutral-800">{label}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>

      <Modal open={isDetailOpen} onClose={() => setIsDetailOpen(false)} ariaLabel="공지사항 상세">
        {selectedNotice && (
          <div className="flex flex-col gap-3">
            <span
              className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${TAG_STYLES[selectedNotice.tag]}`}
            >
              {TAG_LABELS[selectedNotice.tag]}
            </span>
            <h2 className="text-lg font-bold text-neutral-900">{selectedNotice.boardTitle}</h2>
            {selectedNotice.imageFileUrl && <img src={selectedNotice.imageFileUrl} alt="" className="rounded-xl" />}
            <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">{selectedNotice.boardContent}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
