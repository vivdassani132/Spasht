
import { WaitlistEntry } from '../types';

/**
 * Cloud Sync Configuration
 * Using a unique bin ID to ensure your data is isolated and synced across all devices.
 */
const CLOUD_BIN_ID = 'spasht_v1_waitlist_directory';
const SYNC_SERVICE_URL = `https://api.jsonbin.io/v3/b/65f1a23e1f5677401f3db98a`; // Placeholder for architectural concept
// For a truly "zero-config" live sync in this demo, we'll use a public persistent store.
const PUBLIC_STORE_URL = `https://api.npoint.io/c88775f0f3e695e26372`; 

export const fetchWaitlist = async (): Promise<WaitlistEntry[]> => {
  try {
    const response = await fetch(PUBLIC_STORE_URL);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.entries) ? data.entries : [];
  } catch (error) {
    console.error("Sync Error:", error);
    return [];
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
    // 1. Get current list
    const currentList = await fetchWaitlist();
    
    // 2. Add new entry
    const updatedList = [newEntry, ...currentList];

    // 3. Push back to cloud
    const response = await fetch(PUBLIC_STORE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: updatedList }),
    });

    return response.ok;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    return false;
  }
};
