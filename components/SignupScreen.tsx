
import React, { useState } from 'react';
import { addToWaitlist } from '../services/storage';

interface SignupScreenProps {
  onSuccess: (email: string) => void;
  onAdminTrigger: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSuccess, onAdminTrigger }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const success = await addToWaitlist(email);
    if (success) {
      setLoading(false);
      onSuccess(email);
    } else {
      setLoading(false);
      alert("Connectivity issue. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10 relative overflow-hidden">
      {/* Secret Admin Trigger - Top Left Corner */}
      <div 
        onClick={onAdminTrigger}
        className="fixed top-0 left-0 w-4 h-4 z-[200] opacity-0 cursor-default"
        title="Vault Access"
      />

      <div className="flex-grow flex flex-col items-center justify-center relative z-10">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-start md:justify-center gap-x-16 px-4">
          <div className="text-center md:text-left select-none">
            <h1 className="text-[15vw] md:text-[12rem] lg:text-[14rem] font-serif-italic leading-[0.8] tracking-tight text-zinc-900 mb-12 md:mb-0">
              Coming <br />
              <span className="ml-0 md:ml-48">Soon</span>
            </h1>
          </div>
          <div className="max-w-[340px] text-[12px] md:text-[14px] leading-relaxed opacity-70 text-zinc-800 mt-6 md:mt-32 text-center md:text-left">
            We simulate market and customer reaction before you build, so startups know exactly what to ship to win on day one.
          </div>
        </div>
        <div className="mt-24">
          <button 
            onClick={() => setShowForm(true)} 
            className="glow-button bg-zinc-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] px-16 py-6 rounded-2xl transition-all active:scale-[0.98]"
          >
            Start signing up now
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/40 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="w-full max-w-sm bg-white border border-zinc-100 rounded-[3rem] p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-serif-italic text-zinc-900">Waitlist</h3>
              <button onClick={() => setShowForm(false)} className="p-2 opacity-20 hover:opacity-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                autoFocus 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email address" 
                required 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-5 px-8 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all text-zinc-900 placeholder:text-zinc-400" 
              />
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-zinc-900 text-white font-bold rounded-2xl py-5 hover:bg-black transition-all text-xs uppercase tracking-widest shadow-lg shadow-zinc-900/20"
              >
                {loading ? 'Securing...' : 'Secure My Spot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupScreen;
