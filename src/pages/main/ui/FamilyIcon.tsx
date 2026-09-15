import type { SVGProps } from 'react';

import familyIllustration from '@/features/auth/assets/family.svg';

// family.svg는 다른 화면에서도 <img>로 쓰는 큰 일러스트(784KB) — ?react로 불러오면
// 메인 번들에 통째로 인라인되어 번들이 커지므로, 정적 파일로 참조되는 <img>로 렌더링
export function FamilyIcon({ className }: SVGProps<SVGSVGElement>) {
  return <img src={familyIllustration} alt="" className={className} />;
}
