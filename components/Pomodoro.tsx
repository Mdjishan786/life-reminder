
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Focus, Settings2, Check, Volume2 } from 'lucide-react';
import { UserSettings } from '../types';

interface PomodoroProps {
  settings?: UserSettings;
}

const Pomodoro: React.FC<PomodoroProps> = ({ settings }) => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [isSetting, setIsSetting] = useState(false);
  const timerRef = useRef<any>(null);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const handleApplySettings = () => {
    setIsSetting(false);
    resetTimer();
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Use custom focus sound if available, otherwise fallback to default beep
      const defaultBeep = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
      const audioUrl = settings?.focusAlarmSound || defaultBeep;
      
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Timer audio failed:", e));
      
      setIsActive(false);
      switchMode(mode === 'work' ? 'break' : 'work');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, workMinutes, breakMinutes, settings?.focusAlarmSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
          <Focus className="w-5 h-5 text-red-500" /> Focus Timer
        </h3>
        <div className="flex items-center gap-2">
           {!isSetting && (
             <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
               <button 
                 onClick={() => switchMode('work')}
                 className={`px-3 py-1 text-sm font-semibold rounded-lg transition-all ${mode === 'work' ? 'bg-white dark:bg-gray-600 shadow-sm text-red-600' : 'text-gray-500'}`}
               >
                 Work
               </button>
               <button 
                 onClick={() => switchMode('break')}
                 className={`px-3 py-1 text-sm font-semibold rounded-lg transition-all ${mode === 'break' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-gray-500'}`}
               >
                 Break
               </button>
             </div>
           )}
           <button 
            onClick={() => setIsSetting(!isSetting)}
            className={`p-2 rounded-xl transition-all ${isSetting ? 'bg-green-500 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}
           >
            {isSetting ? <Check className="w-4 h-4" onClick={handleApplySettings} /> : <Settings2 className="w-4 h-4" />}
           </button>
        </div>
      </div>

      {isSetting ? (
        <div className="space-y-4 py-4 animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Work (min)</label>
              <input 
                type="number" 
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl px-4 py-2 font-bold dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Break (min)</label>
              <input 
                type="number" 
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl px-4 py-2 font-bold dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold px-1">
            <Volume2 className="w-3 h-3" /> {settings?.focusAlarmSound ? "Custom Sound Active" : "Default Sound Active"}
          </div>
          <button 
            onClick={handleApplySettings}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition-all"
          >
            Apply Changes
          </button>
        </div>
      ) : (
        <div className="text-center animate-in fade-in duration-500">
          <div className={`text-6xl font-black mb-6 ${mode === 'work' ? 'text-red-500' : 'text-blue-500'}`}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={toggleTimer}
              className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${isActive ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200' : 'bg-red-500 text-white shadow-red-200'}`}
            >
              {isActive ? <Pause /> : <Play />}
            </button>
            <button 
              onClick={resetTimer}
              className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <RotateCcw />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
