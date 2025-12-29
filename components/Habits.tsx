
import React, { useState } from 'react';
import { 
  Plus, 
  Minus,
  Trash2, 
  Flame, 
  X,
  Sparkles,
  Target,
  AlertTriangle,
  Activity,
  TrendingUp,
  Palette
} from 'lucide-react';
import { Habit } from '../types';
import { generateId } from '../store';
import { HABIT_TEMPLATES } from '../constants';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

interface HabitsProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  settings: any;
}

const COLOR_OPTIONS = [
  { name: 'Emerald', hex: '#10B981', bg: 'bg-emerald-500' },
  { name: 'Blue', hex: '#3B82F6', bg: 'bg-blue-500' },
  { name: 'Rose', hex: '#F43F5E', bg: 'bg-rose-500' },
  { name: 'Amber', hex: '#F59E0B', bg: 'bg-amber-500' },
  { name: 'Purple', hex: '#8B5CF6', bg: 'bg-purple-500' },
  { name: 'Indigo', hex: '#6366F1', bg: 'bg-indigo-500' },
];

const Habits: React.FC<HabitsProps> = ({ habits, setHabits, settings }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(1);
  const [monthlyLimit, setMonthlyLimit] = useState(30); 
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const today = new Date().toISOString().split('T')[0];

  const addHabit = (name: string) => {
    if (!name) return;
    
    const existing = habits.find(h => h.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      alert("This habit already exists!");
      setShowAdd(false);
      return;
    }

    const newHabit: Habit = {
      id: generateId(),
      userId: '1',
      name: name,
      icon: 'sparkles',
      days: [0, 1, 2, 3, 4, 5, 6],
      completedDates: [],
      logs: {},
      createdAt: today,
      dailyGoal: dailyGoal,
      goal: monthlyLimit,
      color: selectedColor.hex
    };
    setHabits([...habits, newHabit]);
    setShowAdd(false);
    setHabitName('');
    setDailyGoal(1);
    setMonthlyLimit(30);
  };

  const updateCount = (habitId: string, delta: number) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const currentLogs = { ...(h.logs || {}) };
        const currentVal = currentLogs[today] || 0;
        const newVal = Math.max(0, currentVal + delta);
        
        currentLogs[today] = newVal;
        let newCompletedDates = [...(h.completedDates || [])];
        if (newVal >= h.dailyGoal && !newCompletedDates.includes(today)) {
          newCompletedDates.push(today);
        } else if (newVal < h.dailyGoal) {
          newCompletedDates = newCompletedDates.filter(d => d !== today);
        }

        return { ...h, logs: currentLogs, completedDates: newCompletedDates };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    if (confirm('Delete this habit and all history?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  // Portfolio Data: Aggregate all habits into one stock chart
  const chartData = habits.length > 0 ? habits.map(h => {
    const totalUnits = Object.values(h.logs || {}).reduce((a: number, b: number) => a + b, 0);
    return {
      name: h.name,
      units: totalUnits,
      color: h.color || '#10B981'
    };
  }).sort((a, b) => a.units - b.units) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black dark:text-white">Habit Portfolio</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your daily assets and discipline.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-[24px] flex items-center gap-2 font-black shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Open New Position
        </button>
      </div>

      {/* Main Stock Terminal Graph */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <TrendingUp className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-green-500 font-black text-sm uppercase tracking-[0.2em] mb-1">
              <Activity className="w-4 h-4 animate-spin-slow" /> Market Overview
            </div>
            <h3 className="text-2xl font-black dark:text-white">Performance Index</h3>
          </div>
          <div className="flex gap-2">
            {habits.slice(0, 4).map(h => (
              <div key={h.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }}></div>
                <span className="text-[10px] font-black dark:text-gray-300 uppercase">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-96 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                <defs>
                   {habits.map(h => (
                     <linearGradient key={`grad-${h.id}`} id={`color-${h.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={h.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={h.color} stopOpacity={0}/>
                     </linearGradient>
                   ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={settings.darkMode ? '#1f2937' : '#f3f4f6'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  interval={0} // Force all names to show
                  tick={{ fill: settings.darkMode ? '#9ca3af' : '#6b7280', fontSize: 10, fontWeight: 800 }}
                  dy={15}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Tooltip 
                   cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                   contentStyle={{ 
                     borderRadius: '24px', 
                     border: 'none', 
                     backgroundColor: settings.darkMode ? '#111827' : '#fff',
                     boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                     padding: '16px'
                   }}
                />
                <Area 
                  type="monotone" 
                  dataKey="units" 
                  stroke={settings.darkMode ? '#fff' : '#111827'} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#color-units-default)" 
                  animationDuration={2500}
                >
                  <LabelList 
                    dataKey="units" 
                    position="top" 
                    offset={15} 
                    style={{ fill: settings.darkMode ? '#fff' : '#111827', fontSize: 12, fontWeight: 900 }} 
                  />
                  <LabelList 
                    dataKey="name" 
                    position="top" 
                    offset={35} 
                    style={{ fill: '#9ca3af', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }} 
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
              <Activity className="w-16 h-16 mb-4 opacity-10" />
              <p className="font-bold">No assets tracked yet. Open a position to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Individual Habit "Stock Cards" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map(habit => {
          const countToday = habit.logs?.[today] || 0;
          const isDailyMet = countToday >= habit.dailyGoal;
          const totalUnits = Object.values(habit.logs || {}).reduce((a: number, b: number) => a + b, 0);
          
          return (
            <div key={habit.id} className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all hover:shadow-2xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none -mr-8 -mt-8">
                <div className="w-full h-full rounded-full" style={{ backgroundColor: habit.color }}></div>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: habit.color, color: '#fff' }}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">{habit.name}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth:</span>
                       <span className="text-[10px] font-black text-green-500">+{totalUnits} Total</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>

              {/* Mini Individual Trend Line (Placeholder logic for visuals) */}
              <div className="h-16 w-full mb-6 opacity-40">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      {v: 10}, {v: 15}, {v: 8}, {v: 20}, {v: 18}, {v: 25}, {v: countToday}
                    ]}>
                      <Area type="monotone" dataKey="v" stroke={habit.color} fill={habit.color} fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <div className="text-2xl font-black dark:text-white">
                    {countToday} <span className="text-xs text-gray-400 font-bold">/ {habit.dailyGoal}</span>
                 </div>
                 {isDailyMet && <div className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">GOAL MET</div>}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateCount(habit.id, -1)}
                  className="p-4 bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => updateCount(habit.id, 1)}
                  className="flex-1 py-4 rounded-2xl text-white font-black shadow-lg transition-all active:scale-95"
                  style={{ backgroundColor: habit.color }}
                >
                  Log Entry
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Add Habit Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[48px] w-full max-w-xl p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black dark:text-white">New Habit</h3>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-all"><X /></button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Position Name</label>
                <input 
                  type="text" 
                  value={habitName}
                  onChange={e => setHabitName(e.target.value)}
                  placeholder="e.g. Morning Walk, Trading Code..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[24px] px-6 py-5 dark:text-white focus:ring-4 focus:ring-purple-500/20 transition-all font-bold text-lg"
                />
              </div>

              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Choose Color Theme</label>
                 <div className="flex flex-wrap gap-4">
                    {COLOR_OPTIONS.map(c => (
                      <button 
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`w-12 h-12 rounded-2xl transition-all border-4 ${selectedColor.name === c.name ? 'border-gray-900 dark:border-white scale-110 shadow-xl' : 'border-transparent'} ${c.bg}`}
                        title={c.name}
                      />
                    ))}
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Templates</label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {HABIT_TEMPLATES.map(t => (
                      <button 
                        key={t.name}
                        onClick={() => setHabitName(t.name)}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${habitName === t.name ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-700'}`}
                      >
                        <span className="text-sm font-bold truncate">{t.name}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Daily Units</label>
                  <input 
                    type="number" 
                    value={dailyGoal}
                    onChange={e => setDailyGoal(parseInt(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[20px] px-6 py-4 dark:text-white font-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Monthly Cap</label>
                  <input 
                    type="number" 
                    value={monthlyLimit}
                    onChange={e => setMonthlyLimit(parseInt(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[20px] px-6 py-4 dark:text-white font-black"
                  />
                </div>
              </div>

              <button 
                onClick={() => addHabit(habitName)}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-6 rounded-[32px] shadow-2xl transition-all active:scale-95 text-xl"
              >
                Track Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
