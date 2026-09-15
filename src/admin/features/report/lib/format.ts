const MAX_NICKNAME_LENGTH = 8;

/** 닉네임이 길어져도 레이아웃이 흔들리지 않도록 8자로 고정 */
export function truncateNickname(nickname: string): string {
  if (nickname.length <= MAX_NICKNAME_LENGTH) return nickname;
  return `${nickname.slice(0, MAX_NICKNAME_LENGTH)}…`;
}
