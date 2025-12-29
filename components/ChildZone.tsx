
import React, { useState } from 'react';
import { 
  Star, 
  Trophy, 
  Sparkles, 
  Crown, 
  Rocket, 
  Heart,
  Ghost,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { Habit } from '../types';

interface ChildZoneProps {
  habits: Habit[];
}

const ChildZone: React.FC<ChildZoneProps> = ({ habits }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7); // YYYY-MM
  
  // Calculate Daily Stats
  const habitsTodayCount = habits.length;
  const completedToday = habits.filter(h => (h.logs?.[today] || 0) >= h.dailyGoal).length;
  const dailyScore = habitsTodayCount > 0 ? (completedToday / habitsTodayCount) * 100 : 0;
  const dailyStars = Math.ceil((dailyScore / 100) * 5) || 0;

  // Calculate Monthly Stats
  const monthlyLogs = habits.reduce((acc, h) => {
    // FIX: Cast val to number in reduce callback to resolve "Operator '+' cannot be applied to types 'number' and 'unknown'" error.
    const monthUnits = Object.entries(h.logs || {}).reduce((sum: number, [date, val]) => {
      return date.startsWith(currentMonth) ? sum + (val as number) : sum;
    }, 0);
    return acc + monthUnits;
  }, 0);

  const monthlyGoals = habits.reduce((acc, h) => acc + (h.goal || 30), 0);
  const monthlyScore = monthlyGoals > 0 ? (monthlyLogs / monthlyGoals) * 100 : 0;
  const monthlyStars = Math.ceil((monthlyScore / 100) * 5) || 0;

  const activeStars = viewMode === 'daily' ? dailyStars : monthlyStars;
  const activeScore = viewMode === 'daily' ? dailyScore : monthlyScore;

  const getRank = (score: number) => {
    if (score >= 100) return { title: "Legendary Hero!", color: "text-yellow-500", icon: <Crown /> };
    if (score >= 80) return { title: "Super Star!", color: "text-pink-500", icon: <Trophy /> };
    if (score >= 50) return { title: "Rising Hero", color: "text-blue-500", icon: <Rocket /> };
    if (score > 0) return { title: "Good Start!", color: "text-green-500", icon: <Heart /> };
    return { title: "Let's Begin!", color: "text-gray-400", icon: <Ghost /> };
  };

  const rank = getRank(activeScore);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Top Banner with Toggle */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-20 -mb-20 blur-2xl animate-bounce-short"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex bg-white/20 p-1.5 rounded-2xl mb-8 backdrop-blur-md">
             <button 
               onClick={() => setViewMode('daily')}
               className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs transition-all ${viewMode === 'daily' ? 'bg-white text-indigo-600 shadow-xl' : 'text-white/60 hover:text-white'}`}
             >
               <Clock className="w-4 h-4" /> DAILY RATING
             </button>
             <button 
               onClick={() => setViewMode('monthly')}
               className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs transition-all ${viewMode === 'monthly' ? 'bg-white text-indigo-600 shadow-xl' : 'text-white/60 hover:text-white'}`}
             >
               <Calendar className="w-4 h-4" /> MONTHLY GOAL
             </button>
          </div>

          <div className="bg-white/20 p-4 rounded-full mb-4">
            <Sparkles className="w-12 h-12 text-yellow-300 animate-spin-slow" />
          </div>
          <h2 className="text-4xl font-black mb-2">Kid's Hero Zone</h2>
          <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm">
            {viewMode === 'daily' ? "Check today's star power!" : "Your big mission this month!"}
          </p>
          
          <div className="mt-8 flex gap-3">
            {[1, 2, 3, 4, 5].map(num => (
              <Star 
                key={num} 
                className={`w-14 h-14 transition-all duration-1000 ${num <= activeStars ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'text-white/20'}`} 
              />
            ))}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-xl px-10 py-8 rounded-[40px] border border-white/30 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
             <div className={`w-20 h-20 rounded-3xl bg-white flex items-center justify-center ${rank.color} shadow-2xl scale-110`}>
               {React.cloneElement(rank.icon as React.ReactElement, { className: "w-12 h-12" })}
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Your current Rank</p>
                <h3 className="text-3xl font-black mb-1">{rank.title}</h3>
                <p className="text-sm font-bold opacity-90">
                  {viewMode === 'daily' 
                    ? `You did ${completedToday} tasks today! Great work!` 
                    : `You collected ${monthlyLogs} units this month. Almost there!`}
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Habit Follow-up */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black dark:text-white flex items-center gap-2">
              <Target className="text-indigo-500" /> Today's Mission Review
            </h3>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Target: {habitsTodayCount} Tasks</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {habits.length > 0 ? habits.map(habit => {
              const countToday = habit.logs?.[today] || 0;
              const isMet = countToday >= habit.dailyGoal;
              
              return (
                <div 
                  key={habit.id} 
                  className={`p-6 rounded-[32px] border-2 flex items-center justify-between transition-all ${isMet ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isMet ? 'bg-green-500' : 'bg-gray-400'}`} style={{ backgroundColor: isMet ? undefined : '#94a3b8' }}>
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black dark:text-white">{habit.name}</h4>
                      <p className={`text-sm font-bold ${isMet ? 'text-green-600' : 'text-gray-400'}`}>
                        {isMet ? 'Challenge Finished! ✨' : `Only ${habit.dailyGoal - countToday} more to go!`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Progress</p>
                      <p className="text-lg font-black dark:text-white">{countToday} / {habit.dailyGoal}</p>
                    </div>
                    {isMet ? (
                      <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full opacity-30">
                        <XCircle className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-[40px] text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Ghost className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                <h4 className="text-xl font-black text-gray-400">No Hero Missions Found!</h4>
                <p className="text-sm text-gray-400 mt-1">Add habits to start earning stars.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
             <h4 className="text-xl font-black dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-500" /> Score Card
             </h4>
             <div className="flex flex-col items-center text-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      className="text-gray-100 dark:text-gray-700" 
                    />
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * activeScore) / 100}
                      className="text-indigo-500 transition-all duration-1000 ease-out" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black dark:text-white">{Math.round(activeScore)}%</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Power Level</span>
                  </div>
                </div>
                <p className="mt-8 text-sm font-bold text-gray-500 dark:text-gray-400 italic">
                  "Every small step makes you a legend!"
                </p>
             </div>
          </div>

          <div className="bg-indigo-500 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="text-xl font-black mb-4">Secret Reward?</h4>
            <p className="text-sm text-indigo-100 mb-6 font-bold">Earn 100% daily rating to unlock the mystery badge!</p>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl blur-[2px] select-none">
               🎁
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildZone;
