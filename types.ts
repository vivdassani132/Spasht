
export interface WaitlistEntry {
  date: string;
  time: string;
  email: string;
}

export enum AppState {
  SIGNUP = 'SIGNUP',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN'
}
