
import React, { useState } from 'react';
import SignupScreen from './components/SignupScreen';
import SuccessScreen from './components/SuccessScreen';
import AdminPanel from './components/AdminPanel';
import { AppState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.SIGNUP);

  const renderView = () => {
    switch (view) {
      case AppState.SIGNUP:
        return (
          <SignupScreen 
            onSuccess={() => setView(AppState.SUCCESS)} 
            onAdminClick={() => setView(AppState.ADMIN)}
          />
        );
      case AppState.SUCCESS:
        return <SuccessScreen />;
      case AppState.ADMIN:
        return <AdminPanel onBack={() => setView(AppState.SIGNUP)} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-zinc-200">
      {/* Colorful Wave effect at bottom like in the photo */}
      <div className="wave-container">
        <div className="wave wave-1 animate-pulse"></div>
        <div className="wave wave-2 animate-bounce transition-all duration-[5000ms]"></div>
      </div>

      {/* Grain Overlay for texture */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full min-h-screen flex flex-col">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
