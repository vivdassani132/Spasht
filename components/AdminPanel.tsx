
import React, { useEffect, useState } from 'react';
import { WaitlistEntry } from '../types';
import { getWaitlist, clearWaitlist } from '../services/storage';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [list, setList] = useState<WaitlistEntry[]>([]);
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // The SHA-256 hash of "admin123"
  const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

  useEffect(() => {
    if (authorized) {
      setList(getWaitlist());
    }
  }, [authorized]);

  // Helper function to hash the input password
  const hashPassword = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      const inputHash = await hashPassword(password);
      if (inputHash === ADMIN_HASH) {
        setAuthorized(true);
      } else {
        alert('Access Denied: Invalid Credentials');
      }
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-zinc-50 relative z-50">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif-italic text-zinc-900">Vault Access</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2">Spasht Internal Directory</p>
          </div>
          <input
            type="password"
            placeholder="Enter access key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-center tracking-[0.3em]"
          />
          <div className="flex flex-col gap-3">
            <button 
              disabled={isVerifying}
              type="submit" 
              className="w-full bg-zinc-900 text-white rounded-2xl py-4 font-bold hover:bg-black transition-all disabled:opacity-50 text-xs uppercase tracking-widest shadow-xl shadow-zinc-900/10"
            >
              {isVerifying ? 'Verifying...' : 'Unlock Directory'}
            </button>
            <button onClick={onBack} type="button" className="w-full text-zinc-400 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-zinc-900 transition-colors">
              Go Back
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-700 relative z-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-serif-italic mb-2 text-zinc-900 tracking-tight">Directory</h1>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em]">{list.length} Verified Entries</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { if(confirm('Are you sure? This will permanently delete all signup data.')) { clearWaitlist(); setList([]); } }} 
            className="px-8 py-4 border border-zinc-100 text-zinc-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            Flush Data
          </button>
          <button onClick={onBack} className="px-8 py-4 bg-zinc-900 text-white rounded-xl hover:bg-black transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-zinc-900/10">
            Exit
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50 bg-zinc-50/30 text-zinc-400 text-[9px] uppercase tracking-[0.3em] font-bold">
                <th className="px-10 py-6">Identity / Email</th>
                <th className="px-10 py-6 text-right">Acquisition Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {list.length > 0 ? (
                list.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-10 py-6 text-zinc-900 font-medium text-sm">{entry.email}</td>
                    <td className="px-10 py-6 text-zinc-400 text-right text-xs font-medium">
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-10 py-32 text-center text-zinc-300 font-serif-italic text-3xl">
                    Directory is currently vacant.
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
