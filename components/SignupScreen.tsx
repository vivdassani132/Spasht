
import React, { useState } from 'react';
import { addToWaitlist } from '../services/storage';

interface SignupScreenProps {
  onSuccess: (email: string) => void;
  onAdminClick: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSuccess, onAdminClick }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      addToWaitlist(email);
      setLoading(false);
      onSuccess(email);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 relative overflow-hidden">
      {/* Hidden Admin Access Trigger (Invisible top-left corner) */}
      <div 
        onClick={onAdminClick} 
        className="fixed top-0 left-0 w-16 h-16 z-[60] cursor-default"
      ></div>

      {/* Main Hero Content */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-x-12 px-4">
          
          <div className="text-center md:text-left">
            <h1 className="text-8xl md:text-9xl lg:text-[13rem] font-serif-italic leading-[0.8] tracking-tight text-zinc-900 mb-8 md:mb-0">
              Coming <br />
              <span className="ml-0 md:ml-40">Soon</span>
            </h1>
          </div>

          <div className="max-w-[320px] text-[11px] md:text-[13px] leading-relaxed opacity-60 text-zinc-800 mt-6 md:mt-24 self-center md:self-start text-center md:text-left">
            We simulate market and customer reaction before you build, so startups know exactly what to ship to win on day one.
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <button 
            onClick={() => setShowForm(true)}
            className="glow-button bg-zinc-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-12 py-5 rounded-xl hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            Start signing up now
          </button>
        </div>
      </div>

      {/* Signup Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/70 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-serif-italic">Spasht Waitlist</h3>
              <button onClick={() => setShowForm(false)} className="p-1 opacity-30 hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-1 focus:ring-zinc-900/5 transition-all text-zinc-900 placeholder:text-zinc-400"
              />
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-zinc-900 text-white font-bold rounded-2xl py-4 hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm"
              >
                {loading ? 'Joining...' : 'Secure My Spot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupScreen;
