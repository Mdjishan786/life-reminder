
import React from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  Focus,
  Download,
  Upload,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const toggleSetting = (key: keyof UserSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'customAlarmSound' | 'focusAlarmSound') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSettings(prev => ({ ...prev, [field]: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const userId = localStorage.getItem('lifeflow_active_user_id');
    if (!userId) return;
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes(userId)) {
        allData[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(allData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const Switch = ({ active, onClick, color = 'bg-green-500' }: { active: boolean, onClick: () => void, color?: string }) => (
    <button 
      onClick={onClick}
      className={`w-14 h-8 rounded-full relative transition-all ${active ? color : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-2">
            <SettingsIcon className="text-gray-400" /> Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Configure LifeFlow to your liking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appearance Mode */}
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-black mb-8 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Sun className="w-5 h-5 text-orange-500" /> Appearance
          </h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-400 font-medium">Saves battery and your eyes.</p>
              </div>
              <Switch active={settings.darkMode} onClick={() => toggleSetting('darkMode')} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold dark:text-white">Kids Fun Mode</p>
                <p className="text-xs text-gray-400 font-medium">Bubbly fonts and star ratings.</p>
              </div>
              <Switch 
                active={settings.kidsMode} 
                color="bg-pink-500"
                onClick={() => setSettings(prev => ({ ...prev, kidsMode: !prev.kidsMode, seniorMode: false }))} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold dark:text-white">Senior Citizen Mode</p>
                <p className="text-xs text-gray-400 font-medium">High contrast and larger text.</p>
              </div>
              <Switch 
                active={settings.seniorMode} 
                color="bg-blue-500"
                onClick={() => setSettings(prev => ({ ...prev, seniorMode: !prev.seniorMode, kidsMode: false }))} 
              />
            </div>
          </div>
        </div>

        {/* Audio Configuration */}
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-black mb-8 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-500" /> Audio & Alerts
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Reminder Ringtone</label>
              <div className="flex items-center gap-4">
                 <input 
                  type="file" 
                  accept="audio/*"
                  onChange={e => handleSoundUpload(e, 'customAlarmSound')}
                  className="block w-full text-xs text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
                {settings.customAlarmSound && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Focus Timer Sound</label>
              <div className="flex items-center gap-4">
                 <input 
                  type="file" 
                  accept="audio/*"
                  onChange={e => handleSoundUpload(e, 'focusAlarmSound')}
                  className="block w-full text-xs text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                />
                {settings.focusAlarmSound && <CheckCircle2 className="w-6 h-6 text-red-500 shrink-0" />}
              </div>
            </div>
          </div>
        </div>

        {/* Data Persistence */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-xl font-black mb-8 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" /> Data Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={exportData}
              className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-[32px] font-black dark:text-white hover:bg-gray-100 transition-all group"
            >
              <div className="text-left">
                 <p className="text-sm">Download Backup</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase">JSON FORMAT</p>
              </div>
              <Download className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-[32px] font-black dark:text-white hover:bg-gray-100 transition-all group"
            >
              <div className="text-left">
                 <p className="text-sm">Restore Data</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase">UPLOAD FILE</p>
              </div>
              <Upload className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
