import { Modal } from '@/shared/ui';

interface ForceDeleteDialogProps {
  open: boolean;
  isPending: boolean;
  /** 삭제 대상 명칭, 예: '게시글', '댓글' */
  targetLabel: string;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ForceDeleteDialog({
  open,
  isPending,
  targetLabel,
  errorMessage,
  onClose,
  onConfirm,
}: ForceDeleteDialogProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel={`${targetLabel} 강제삭제 확인 대화상자`}>
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-red-500">FORCE DELETE</p>
        <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">
          이 {targetLabel}을(를) 강제삭제할까요?
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600">삭제 후에는 다시 복구할 수 없어요.</p>

        {errorMessage ? <p className="mt-4 text-sm text-red-500">{errorMessage}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? '삭제 중...' : '강제삭제'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
