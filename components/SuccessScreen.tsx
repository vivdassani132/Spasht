
import React, { useState } from 'react';
import { CopyIcon, WhatsAppIcon, XIcon } from './Icons';

const SuccessScreen: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent("I just joined the Spasht waitlist! Check it out:");
    const url = encodeURIComponent(referralLink);
    
    let shareUrl = "";
    if (platform === 'x') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (platform === 'wa') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 animate-in fade-in zoom-in-95 duration-700 relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-6xl md:text-[7rem] font-serif-italic mb-4 tracking-tighter leading-none text-zinc-900">
          You're in.
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-medium tracking-wide uppercase">
          Welcome to Spasht
        </p>
      </div>

      <div className="w-full max-w-sm bg-white border border-zinc-100 rounded-[2.5rem] p-10 backdrop-blur-md mb-12 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)]">
        <label className="block text-[9px] uppercase tracking-[0.3em] text-zinc-300 mb-6 font-bold text-center">Referral Link</label>
        <div className="relative mb-8">
          <input
            readOnly
            value={referralLink}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-6 pr-14 text-[11px] font-medium focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-all active:scale-90"
          >
            {copied ? (
               <span className="text-[10px] font-bold">OK</span>
            ) : (
               <CopyIcon />
            )}
          </button>
        </div>

        <div className="flex justify-center gap-4">
           <button onClick={() => handleShare('x')} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all text-[11px] font-bold uppercase tracking-wider">
             <XIcon /> <span>Share</span>
           </button>
           <button onClick={() => handleShare('wa')} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1BD741] text-white hover:opacity-90 transition-all text-[11px] font-bold uppercase tracking-wider">
             <WhatsAppIcon /> <span>Share</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
