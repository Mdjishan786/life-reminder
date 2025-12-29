
import React, { useEffect, useRef } from 'react';
import { Bell, Clock, Volume2, X } from 'lucide-react';
import { Reminder } from '../types';
import { DEFAULT_ALARM_TONES } from '../constants';

interface AlarmModalProps {
  reminder: Reminder;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  defaultAlarmTone: string;
  customSound?: string;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ 
  reminder, 
  onDismiss, 
  onSnooze, 
  defaultAlarmTone,
  customSound 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const tone = DEFAULT_ALARM_TONES.find(t => t.id === defaultAlarmTone);
    const audioUrl = customSound || tone?.url || DEFAULT_ALARM_TONES[0].url;
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.play().catch(err => console.error("Audio play failed:", err));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [defaultAlarmTone, customSound]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-short">
        <div className="bg-green-500 p-8 flex flex-col items-center text-white relative">
          <button 
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Bell className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-center">{reminder.title}</h2>
          <p className="opacity-90 mt-2 text-center">{reminder.description || "It's time!"}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
            <Clock className="w-5 h-5" />
            <span>Scheduled for {reminder.time}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 30].map(mins => (
              <button
                key={mins}
                onClick={() => onSnooze(mins)}
                className="flex flex-col items-center justify-center p-3 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 transition-all group"
              >
                <span className="text-lg font-bold group-hover:text-green-600 dark:text-gray-200">{mins}m</span>
                <span className="text-xs text-gray-400 uppercase font-semibold">Snooze</span>
              </button>
            ))}
          </div>

          <button
            onClick={onDismiss}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/30 transition-all active:scale-95"
          >
            I'm Done!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
