export type ReportReason =
  | 'SPAM'
  | 'OBSCENITY'
  | 'ABUSE'
  | 'INAPPROPRIATE_PROFILE'
  | 'SPAM_ADVERTISING'
  | 'IMPERSONATION'
  | 'HATE_SPEECH'
  | 'PRIVATE_INFO_EXPOSURE'
  | 'HARASSMENT';

export type ReportTargetType = 'BOARD' | 'COMMENT';

export interface ReportTarget {
  type: ReportTargetType;
  id: number;
}

export interface ReportCreateRequest {
  reportReason: ReportReason;
}

export interface ReportSimpleResponse {
  message: string;
}
