
import React, { useEffect, useState } from 'react';
import { WaitlistEntry } from '../types';
import { fetchWaitlist } from '../services/storage';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [list, setList] = useState<WaitlistEntry[]>([]);
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // SHA-256 of "admin123" (Change this if you want a different password)
  const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

  const hashPassword = async (text: string) => {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    const inputHash = await hashPassword(password);
    if (inputHash === ADMIN_HASH) {
      setAuthorized(true);
    } else {
      alert('Invalid Access Key');
    }
    setVerifying(false);
  };

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      fetchWaitlist().then(data => {
        setList(data);
        setLoading(false);
      });
    }
  }, [authorized]);

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-zinc-50 relative z-50">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif-italic text-zinc-900">Vault Access</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2">Shared Directory Access</p>
          </div>
          <input
            type="password"
            placeholder="Enter access key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-center tracking-[0.3em]"
          />
          <button type="submit" disabled={verifying} className="w-full bg-zinc-900 text-white rounded-2xl py-4 font-bold text-xs uppercase tracking-widest shadow-xl">
            {verifying ? 'Checking...' : 'Unlock'}
          </button>
          <button onClick={onBack} type="button" className="w-full text-zinc-400 py-2 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 max-w-5xl mx-auto animate-in fade-in duration-500 relative z-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-serif-italic mb-2 text-zinc-900">Live Directory</h1>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            {loading ? 'Fetching...' : `${list.length} Real-time entries`}
          </p>
        </div>
        <button onClick={onBack} className="px-8 py-4 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">Exit</button>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-50 bg-zinc-50/30 text-zinc-400 text-[9px] uppercase tracking-[0.3em] font-bold">
              <th className="px-10 py-6">Email Address</th>
              <th className="px-10 py-6 text-right">Signup Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {list.map((entry, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-10 py-6 text-zinc-900 font-medium text-sm">{entry.email}</td>
                <td className="px-10 py-6 text-zinc-400 text-right text-xs">
                  {entry.date} at {entry.time}
                </td>
              </tr>
            ))}
            {list.length === 0 && !loading && (
              <tr><td colSpan={2} className="px-10 py-32 text-center text-zinc-300 font-serif-italic text-2xl">No entries found in Google Sheets.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
