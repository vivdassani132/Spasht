
import { WaitlistEntry } from '../types';

/**
 * GLOBAL SYNC CONFIGURATION
 * We use a unique, persistent key to sync data across all devices globally.
 */
const SYNC_KEY = '34a780d1_spasht_global_directory_v2';
const SYNC_API_URL = `https://api.keyvalue.xyz/${SYNC_KEY}`;

// Helper to fetch the current list from the cloud
export const fetchWaitlist = async (): Promise<WaitlistEntry[]> => {
  try {
    const response = await fetch(SYNC_API_URL);
    if (!response.ok) {
      // If it's the first time and the key doesn't exist, return empty
      return [];
    }
    const rawData = await response.text();
    const data = JSON.parse(rawData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Cloud Sync Error (Fetch):", error);
    // Fallback to local storage if cloud is momentarily unreachable
    const local = localStorage.getItem('spasht_backup');
    return local ? JSON.parse(local) : [];
  }
};

export const addToWaitlist = async (email: string): Promise<boolean> => {
  const now = new Date();
  const newEntry: WaitlistEntry = {
    email,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
  };

  try {
    // 1. Get the current global state
    const currentList = await fetchWaitlist();
    
    // 2. Append new entry (at the top)
    const updatedList = [newEntry, ...currentList];
    const payload = JSON.stringify(updatedList);

    // 3. Update Global Cloud State (using POST to update the keyvalue store)
    const response = await fetch(SYNC_API_URL, {
      method: 'POST',
      body: payload,
    });

    if (response.ok) {
      localStorage.setItem('spasht_backup', payload);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Cloud Sync Error (Save):", error);
    return false;
  }
};
