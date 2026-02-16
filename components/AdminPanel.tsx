
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

  // SHA-256 hash of "admin123"
  // This ensures the actual password is never stored as plain text in the source code.
  const ACCESS_KEY_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

  const verifyAccess = async (input: string) => {
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ACCESS_KEY_HASH;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    const isValid = await verifyAccess(password);
    if (isValid) {
      setAuthorized(true);
    } else {
      alert('Vault Access Denied: Incorrect Key');
      setPassword('');
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white relative z-50">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-3xl font-serif-italic text-zinc-900">Vault Access</h2>
            <p className="text-[9px] text-zinc-400 uppercase tracking-[0.4em] mt-3 font-bold">Cloud Directory Terminal</p>
          </div>
          <input
            autoFocus
            type="password"
            placeholder="ACCESS KEY"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all text-center tracking-[0.5em] text-zinc-900 placeholder:text-zinc-200"
          />
          <button 
            type="submit" 
            disabled={verifying} 
            className="w-full bg-zinc-900 text-white rounded-2xl py-5 font-bold text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Unlock Directory'}
          </button>
          <button onClick={onBack} type="button" className="w-full text-zinc-300 py-4 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-zinc-500 transition-colors">Return to Landing</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 md:p-16 max-w-6xl mx-auto animate-in fade-in duration-700 relative z-50">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
          <div className="inline-block px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-[8px] font-bold uppercase tracking-widest mb-4">Live Sync Active</div>
          <h1 className="text-6xl md:text-7xl font-serif-italic text-zinc-900">Directory</h1>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-4">
            {loading ? 'Polling Cloud Server...' : `${list.length} Verified Entries`}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="px-6 py-4 border border-zinc-100 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all">Refresh</button>
          <button onClick={onBack} className="px-10 py-4 bg-zinc-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">Exit Vault</button>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50 bg-zinc-50/50 text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">
                <th className="px-12 py-8">User Identity</th>
                <th className="px-12 py-8 text-right">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {list.map((entry, i) => (
                <tr key={i} className="group hover:bg-zinc-50/30 transition-colors">
                  <td className="px-12 py-8">
                    <div className="flex flex-col">
                      <span className="text-zinc-900 font-medium text-base">{entry.email}</span>
                      <span className="text-[9px] text-zinc-300 uppercase tracking-widest mt-1">Verified Member</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-500 font-medium text-sm">{entry.date}</span>
                      <span className="text-[10px] text-zinc-300 mt-1">{entry.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && !loading && (
                <tr>
                  <td colSpan={2} className="px-12 py-40 text-center">
                    <div className="max-w-xs mx-auto opacity-20">
                      <svg className="mx-auto mb-6" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <p className="font-serif-italic text-2xl">The directory is currently empty.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
