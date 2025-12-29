
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  CheckCircle2, 
  Calendar, 
  User as UserIcon, 
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Baby
} from 'lucide-react';

import { 
  getUsers, 
  getActiveUserId, 
  getUserData, 
  saveUserData, 
  setActiveUserId, 
  DEFAULT_SETTINGS 
} from './store';
import { User, Reminder, Habit, UserSettings, CalendarNote } from './types';

// Pages
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
import Reminders from './components/Reminders';
import Habits from './components/Habits';
import Profile from './components/Profile';
import Settings from './components/Settings';
import CalendarView from './components/CalendarView';
import AlarmModal from './components/AlarmModal';
import SplashScreen from './components/SplashScreen';
import ChildZone from './components/ChildZone';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activeAlarm, setActiveAlarm] = useState<Reminder | null>(null);

  // Initialize App
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);

    const userId = getActiveUserId();
    if (userId) {
      const users = getUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
        loadUserData(userId);
      } else {
        setActiveUserId(null);
        navigate('/login');
      }
    } else if (!['/login', '/signup'].includes(location.pathname)) {
      navigate('/login');
    }

    return () => clearTimeout(timer);
  }, []);

  const loadUserData = (userId: string) => {
    setReminders(getUserData<Reminder[]>('reminders', userId, []));
    setHabits(getUserData<Habit[]>('habits', userId, []));
    setNotes(getUserData<CalendarNote[]>('notes', userId, []));
    setSettings(getUserData<UserSettings>('settings', userId, DEFAULT_SETTINGS));
  };

  // Persist data on changes
  useEffect(() => {
    if (currentUser) {
      saveUserData('reminders', currentUser.id, reminders);
      saveUserData('habits', currentUser.id, habits);
      saveUserData('notes', currentUser.id, notes);
      saveUserData('settings', currentUser.id, settings);
    }
  }, [reminders, habits, notes, settings, currentUser]);

  // Dark mode / Modes handler
  useEffect(() => {
    const body = document.body;
    if (settings.darkMode) body.classList.add('dark'); else body.classList.remove('dark');
    if (settings.kidsMode) body.classList.add('kids-mode'); else body.classList.remove('kids-mode');
    if (settings.seniorMode) body.classList.add('senior-mode'); else body.classList.remove('senior-mode');
  }, [settings.darkMode, settings.kidsMode, settings.seniorMode]);

  // Reminder checking engine
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTimeStr = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      reminders.forEach(reminder => {
        if (!reminder.completed && reminder.date === today && reminder.time === currentTimeStr) {
          if (reminder.lastTriggered !== currentTimeStr) {
            setActiveAlarm(reminder);
            setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, lastTriggered: currentTimeStr } : r));
          }
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders]);

  const handleLogout = () => {
    setActiveUserId(null);
    setCurrentUser(null);
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { label: 'Child Zone', icon: <Baby />, path: '/kids' },
    { label: 'Reminders', icon: <Bell />, path: '/reminders' },
    { label: 'Habits', icon: <CheckCircle2 />, path: '/habits' },
    { label: 'Calendar', icon: <Calendar />, path: '/calendar' },
    { label: 'Profile', icon: <UserIcon />, path: '/profile' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  if (showSplash) return <SplashScreen />;

  if (['/login', '/signup'].includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={(u) => { setCurrentUser(u); loadUserData(u.id); navigate('/'); }} />} />
        <Route path="/signup" element={<Signup onSignup={(u) => { setCurrentUser(u); loadUserData(u.id); navigate('/'); }} />} />
      </Routes>
    );
  }

  const snoozeAlarm = (minutes: number) => {
    if (!activeAlarm) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const newTimeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    setReminders(prev => prev.map(r => r.id === activeAlarm.id ? { ...r, time: newTimeStr, lastTriggered: undefined } : r));
    setActiveAlarm(null);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 ${settings.seniorMode ? 'text-lg' : 'text-base'}`}>
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 p-8 sticky top-0 h-screen overflow-hidden">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-green-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black dark:text-white tracking-tight">LifeFlow</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Assistant</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-black text-sm transition-all ${
                location.pathname === item.path 
                ? 'bg-green-500 text-white shadow-2xl shadow-green-100 dark:shadow-none' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-red-500 font-black text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5" /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md dark:bg-gray-800/95 border-t border-gray-100 dark:border-gray-700 flex justify-around p-5 z-50">
        {navItems.slice(0, 4).map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`p-3 rounded-2xl transition-all ${location.pathname === item.path ? 'text-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'text-gray-400'}`}
          >
            {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="p-3 text-red-400 hover:text-red-600 transition-all"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      <main className="flex-1 p-6 md:p-12 pb-28 md:pb-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black dark:text-white tracking-tight">
              {settings.kidsMode ? "Hi " : "Hello, "}{currentUser?.fullName.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {settings.kidsMode ? "You are doing great!" : "Focus on what matters today."}
            </p>
          </div>
          <div 
            onClick={() => navigate('/profile')}
            className="w-16 h-16 rounded-[24px] overflow-hidden shadow-2xl cursor-pointer border-4 border-white dark:border-gray-700 transition-transform active:scale-90"
          >
            <img 
              src={currentUser?.profilePic || `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=4CAF50&color=fff`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard reminders={reminders} habits={habits} settings={settings} />} />
          <Route path="/reminders" element={<Reminders reminders={reminders} setReminders={setReminders} settings={settings} />} />
          <Route path="/habits" element={<Habits habits={habits} setHabits={setHabits} settings={settings} />} />
          <Route path="/kids" element={<ChildZone habits={habits} />} />
          <Route path="/calendar" element={<CalendarView reminders={reminders} habits={habits} notes={notes} setNotes={setNotes} settings={settings} />} />
          <Route path="/profile" element={<Profile user={currentUser} setUser={setCurrentUser} reminders={reminders} habits={habits} />} />
          <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
        </Routes>
      </main>

      {activeAlarm && (
        <AlarmModal 
          reminder={activeAlarm}
          onDismiss={() => {
            if (activeAlarm.repeat === 'Once') {
              setReminders(prev => prev.map(r => r.id === activeAlarm.id ? { ...r, completed: true } : r));
            }
            setActiveAlarm(null);
          }}
          onSnooze={snoozeAlarm}
          defaultAlarmTone={settings.defaultAlarmTone}
          customSound={settings.customAlarmSound}
        />
      )}
    </div>
  );
};

export default App;
