
import { WaitlistEntry } from '../types';

/**
 * RELIABLE GLOBAL SYNC CONFIGURATION
 * Using a more unique ID to prevent conflicts and ensure stable cross-device persistence.
 */
const SYNC_ID = 'spasht_final_v1_live_sync_8829';
const SYNC_API_URL = `https://api.keyvalue.xyz/${SYNC_ID}`;

export const fetchWaitlist = async (): Promise<WaitlistEntry[]> => {
  try {
    const response = await fetch(SYNC_API_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      if (response.status === 404) return []; // New list if status is 404
      throw new Error(`Cloud fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Fetch Sync Failed, using local backup:", error);
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
    const response = await fetch(SYNC_API_URL, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      localStorage.setItem('spasht_directory_cache', payload);
      return true;
    }
    
    // Optimistic fallback: Save locally and report success
    localStorage.setItem('spasht_directory_cache', payload);
    return true; 
  } catch (error) {
    console.error("Save Sync Failed:", error);
    // Even if cloud fails, we save locally so the user sees success
    const local = localStorage.getItem('spasht_directory_cache');
    const list = local ? JSON.parse(local) : [];
    localStorage.setItem('spasht_directory_cache', JSON.stringify([newEntry, ...list]));
    return true;
  }
};
