
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

  useEffect(() => {
    if (authorized) {
      setList(getWaitlist());
    }
  }, [authorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-zinc-50 relative z-50">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <h2 className="text-xl font-bold mb-6 text-center text-zinc-900">Admin Control</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-4 px-6 focus:outline-none"
          />
          <div className="flex flex-col gap-2">
            <button type="submit" className="w-full bg-zinc-900 text-white rounded-2xl py-4 font-bold hover:bg-zinc-800">
              Access Spasht Waitlist
            </button>
            <button onClick={onBack} type="button" className="w-full text-zinc-400 py-2 text-xs font-bold uppercase tracking-widest hover:text-zinc-900">
              Return Home
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500 relative z-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-serif-italic mb-2 text-zinc-900 tracking-tight">Spasht Directory</h1>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">{list.length} successful signups</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { if(confirm('Clear all data?')) { clearWaitlist(); setList([]); } }} 
            className="px-6 py-3 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Flush Data
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-200 transition-colors text-xs font-bold uppercase tracking-widest">
            Close
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50 bg-zinc-50/50 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-8 py-5">Email Participant</th>
                <th className="px-8 py-5 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {list.length > 0 ? (
                list.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="px-8 py-5 text-zinc-900 font-semibold">{entry.email}</td>
                    <td className="px-8 py-5 text-zinc-400 text-right text-xs">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-8 py-20 text-center text-zinc-300 font-serif-italic text-2xl">
                    The waitlist is currently empty.
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
