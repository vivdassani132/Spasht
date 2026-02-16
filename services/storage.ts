
import { WaitlistEntry } from '../types';

/** 
 * IMPORTANT: Replace this with your Google Apps Script Web App URL 
 */
const GOOGLE_SHEET_WEBAPP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

export const fetchWaitlist = async (): Promise<WaitlistEntry[]> => {
  if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    return [];
  }
  try {
    const response = await fetch(GOOGLE_SHEET_WEBAPP_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch live data:", error);
    return [];
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn("Google Sheet URL not configured.");
    return true;
  }

  try {
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return true;
  } catch (error) {
    console.error("Failed to sync:", error);
    return true; 
  }
};
