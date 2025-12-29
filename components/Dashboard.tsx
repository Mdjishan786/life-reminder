
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  Flame, 
  Plus, 
  Activity,
  ArrowRight,
  Droplets,
  Heart,
  Moon,
  Footprints,
  Book,
  Sparkles,
  Baby
} from 'lucide-react';
import { Reminder, Habit, UserSettings } from '../types';
import MotivationalQuote from './MotivationalQuote';
import Pomodoro from './Pomodoro';

interface DashboardProps {
  reminders: Reminder[];
  habits: Habit[];
  settings: UserSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ reminders, habits, settings }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const todayReminders = reminders.filter(r => r.date === today && !r.completed);
  const activeHabits = habits.length;

  const totalUnits = habits.reduce((acc, h) => {
    const habitTotal = Object.values(h.logs || {}).reduce((a: number, b: number) => a + b, 0);
    return acc + habitTotal;
  }, 0);
  
  const totalGoals = habits.reduce((acc, h) => acc + (h.goal || 30), 0);
  const overallProgress = totalGoals > 0 ? Math.round((totalUnits / totalGoals) * 100) : 0;

  const stats = [
    { label: 'Total Reminders', value: reminders.length, icon: <Bell className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: "Today's Tasks", value: todayReminders.length, icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Habits Active', value: activeHabits, icon: <Activity className="w-6 h-6 text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Units', value: totalUnits, icon: <Flame className="w-6 h-6 text-orange-500" />, bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="space-y-8">
      <MotivationalQuote />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
              {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${stat.label === 'Habits Active' ? 'animate-spin-slow' : ''}` })}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold dark:text-white">Today's Reminders</h3>
            <button 
              onClick={() => navigate('/reminders')}
              className="text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              See all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {todayReminders.length > 0 ? (
              todayReminders.map(reminder => (
                <div 
                  key={reminder.id} 
                  className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex flex-col items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                    {reminder.time.split(':')[0]}
                    <span className="text-[10px] opacity-60">
                      {Number(reminder.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold dark:text-white">{reminder.title}</h4>
                    <p className="text-sm text-gray-400">{reminder.category}</p>
                  </div>

                  <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                    Ongoing
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Plus className="text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-500 dark:text-gray-400">
                  No more reminders!
                </h4>
                <p className="text-sm text-gray-400 mt-1">Relax or add a new one.</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
            <div>
              <h4 className="font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <Baby className="w-5 h-5" /> Kid's Hero Zone
              </h4>
              <p className="text-sm text-indigo-500 mt-1">Check today's star rating!</p>
            </div>
            <button 
              onClick={() => navigate('/kids')}
              className="bg-indigo-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              View Rating
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <Pomodoro settings={settings} />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                <Activity className="text-purple-500 animate-spin-slow" /> Goals Today
              </h3>
              <span className={`text-xs font-black px-2 py-1 rounded-lg bg-green-50 text-green-500`}>
                 {overallProgress}% Month
              </span>
            </div>

            <div className="space-y-4">
              {habits.length > 0 ? habits.slice(0, 3).map(habit => {
                const countToday = habit.logs?.[today] || 0;
                const percentage = Math.round((countToday / habit.dailyGoal) * 100);
                const isMet = countToday >= habit.dailyGoal;
                
                return (
                  <div key={habit.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium dark:text-gray-300 flex items-center gap-1">
                        {habit.name}
                      </span>
                      <span className={`font-bold ${isMet ? 'text-green-500' : 'text-gray-400'}`}>
                         {countToday} / {habit.dailyGoal}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isMet ? 'bg-green-500' : 'bg-purple-500'}`} 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-gray-400 text-center py-4 italic">No habits logged for today.</p>
              )}

              <button 
                onClick={() => navigate('/habits')}
                className="w-full py-2 mt-2 text-sm font-bold text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all"
              >
                Go to Habits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
