import { useEffect, useState } from 'react';

import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { Modal } from '@/shared/ui';

import { REPORT_STATUS_MESSAGES } from '../lib/constants';
import { useCreateReport } from '../model/useCreateReport';
import type { ReportReason, ReportTarget } from '../model/types';
import { ReportReasonSelect } from './ReportReasonSelect';

interface ReportDialogProps {
  target: ReportTarget | null;
  onClose: () => void;
}

const COPY = {
  eyebrow: 'REPORT',
  title: '신고하기',
  description: '접수된 신고는 운영팀이 검토합니다.',
  reasonRequired: '신고 사유를 선택해주세요.',
  cancel: '취소',
  submit: '신고하기',
  submitting: '접수 중...',
  successTitle: '신고가 접수되었어요.',
  successDescription: '소중한 제보 감사합니다. 검토 후 처리할게요.',
  confirm: '확인',
  fallbackError: '신고를 접수하지 못했어요. 잠시 후 다시 시도해주세요.',
  reasonPlaceholder: '신고 사유를 선택해주세요',
};

export function ReportDialog({ target, onClose }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutateAsync, isPending, error, reset } = useCreateReport();

  const open = target !== null;

  useEffect(() => {
    if (open) {
      setSelectedReason(null);
      setValidationError('');
      setIsSubmitted(false);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.type, target?.id]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!target) return;

    if (!selectedReason) {
      setValidationError(COPY.reasonRequired);
      return;
    }

    setValidationError('');

    try {
      await mutateAsync({ targetType: target.type, targetId: target.id, reportReason: selectedReason });
      setIsSubmitted(true);
    } catch {
      // 에러 메시지는 아래에서 error 상태로 렌더링
    }
  };

  return (
    <Modal open={open} onClose={handleClose} ariaLabel="신고하기 대화상자">
      {isSubmitted ? (
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">{COPY.eyebrow}</p>
          <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">{COPY.successTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">{COPY.successDescription}</p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              {COPY.confirm}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">{COPY.eyebrow}</p>
          <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">{COPY.title}</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">{COPY.description}</p>

          <div className="mt-5">
            <ReportReasonSelect
              value={selectedReason}
              placeholder={COPY.reasonPlaceholder}
              disabled={isPending}
              onChange={(reason) => {
                setSelectedReason(reason);
                setValidationError('');
              }}
            />
          </div>

          {validationError ? <p className="mt-3 text-sm text-red-500">{validationError}</p> : null}
          {error ? (
            <p className="mt-3 text-sm text-red-500">
              {getApiErrorMessage(error, COPY.fallbackError, REPORT_STATUS_MESSAGES)}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {COPY.cancel}
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? COPY.submitting : COPY.submit}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
