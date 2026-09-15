import type { ComponentType, SVGProps } from 'react';

import { FamilyIcon } from '@/pages/main/ui/FamilyIcon';
import PetIcon from '@/pages/main/assets/pet.svg?react';
import ReportIcon from '@/pages/main/assets/report.svg?react';
import WalkIcon from '@/pages/main/assets/walk.svg?react';

export type QuickLinkItem = {
  id: string;
  label: string;
  to: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** 메인 화면 바로가기 메뉴(정적 내비게이션, API 데이터 아님) */
export const QUICK_LINKS: QuickLinkItem[] = [
  { id: 'pet', label: '나의 반려동물', to: '/my', Icon: PetIcon },
  { id: 'walk', label: '산책 기록', to: '/my?menu=walk-history', Icon: WalkIcon },
  { id: 'report', label: '레포트 보관함', to: '/my?menu=ai-report', Icon: ReportIcon },
  { id: 'family', label: '가족 관리', to: '/my?menu=family', Icon: FamilyIcon },
];
