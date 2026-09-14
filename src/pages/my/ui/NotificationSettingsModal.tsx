import { NotificationSettingsForm } from '@/pages/my/ui/NotificationSettingsForm';
import { Modal } from '@/shared/ui';

interface NotificationSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationSettingsModal({ open, onClose }: NotificationSettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="알림 설정 대화상자">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">NOTICE</p>
        <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">알림 설정</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          산책, 건강, 가족 관리 등 주요 알림을 어떤 방식으로 받을지 설정할 수 있어요.
        </p>

        <div className="mt-5">
          <NotificationSettingsForm />
        </div>
      </div>
    </Modal>
  );
}
