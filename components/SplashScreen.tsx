
import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-green-500 flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="relative">
        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-green-500 shadow-2xl animate-bounce-short">
          <CheckCircle2 className="w-14 h-14" />
        </div>
        <div className="absolute -top-4 -right-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-yellow-300" />
        </div>
      </div>
      
      <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-black tracking-tight mb-2">LifeFlow</h1>
        <p className="text-green-100 font-medium opacity-80 uppercase tracking-[0.2em] text-xs">Smart Daily Assistant</p>
      </div>

      <div className="absolute bottom-12 text-center animate-in fade-in duration-1000 delay-500">
        <p className="text-green-100/60 text-sm font-medium">Version 1.0.0</p>
      </div>
      
      {/* Decorative particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-ping delay-300"></div>
    </div>
  );
};

export default SplashScreen;
