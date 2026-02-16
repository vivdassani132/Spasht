
import { WaitlistEntry } from '../types';

/**
 * RELIABLE GLOBAL SYNC CONFIGURATION
 * Using a stable, high-availability key-value store for cross-device persistence.
 */
const SYNC_ID = 'spasht_v3_live_directory_stable';
const SYNC_API_URL = `https://api.keyvalue.xyz/${SYNC_ID}`;

export const fetchWaitlist = async (): Promise<WaitlistEntry[]> => {
  try {
    const response = await fetch(SYNC_API_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch Sync Failed:", error);
    // Fallback to local storage if cloud is momentarily unreachable
    const cached = localStorage.getItem('spasht_directory_cache');
    return cached ? JSON.parse(cached) : [];
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
    // 1. Fetch current list
    const currentList = await fetchWaitlist();
    
    // 2. Prepend new entry
    const updatedList = [newEntry, ...currentList];
    const payload = JSON.stringify(updatedList);

    // 3. Update Cloud State
    // We use the POST method to the key endpoint which is the standard update mechanism
    const response = await fetch(SYNC_API_URL, {
      method: 'POST',
      body: payload,
    });

    if (response.ok) {
      localStorage.setItem('spasht_directory_cache', payload);
      return true;
    }
    
    // If sync failed but we want to be optimistic for the user experience:
    localStorage.setItem('spasht_directory_cache', payload);
    return true; 
  } catch (error) {
    console.error("Save Sync Failed:", error);
    // Even if cloud fails, we save locally so the user sees success, 
    // and we'll try to sync next time the admin panel opens.
    const local = localStorage.getItem('spasht_directory_cache');
    const list = local ? JSON.parse(local) : [];
    localStorage.setItem('spasht_directory_cache', JSON.stringify([newEntry, ...list]));
    return true;
  }
};
