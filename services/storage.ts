
import { WaitlistEntry } from '../types';

const STORAGE_KEY = 'pendly_waitlist';

export const getWaitlist = (): WaitlistEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToWaitlist = (email: string): WaitlistEntry => {
  const list = getWaitlist();
  const newEntry: WaitlistEntry = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    timestamp: Date.now(),
    referralCount: 0,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, newEntry]));
  return newEntry;
};

export const clearWaitlist = () => {
  localStorage.removeItem(STORAGE_KEY);
};
