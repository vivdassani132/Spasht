
export interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: number;
  referralCount: number;
}

export enum AppState {
  SIGNUP = 'SIGNUP',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN'
}
