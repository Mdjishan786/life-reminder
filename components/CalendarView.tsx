
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Circle,
  X,
  StickyNote,
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Reminder, Habit, CalendarNote } from '../types';
import { generateId } from '../store';

interface CalendarProps {
  reminders: Reminder[];
  habits: Habit[];
  notes: CalendarNote[];
  setNotes: React.Dispatch<React.SetStateAction<CalendarNote[]>>;
  settings: any;
}

const CalendarView: React.FC<CalendarProps> = ({ reminders, habits, notes, setNotes, settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState('bg-yellow-100');

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthYearStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const colors = [
    { name: 'Yellow', class: 'bg-yellow-100 text-yellow-700' },
    { name: 'Blue', class: 'bg-blue-100 text-blue-700' },
    { name: 'Green', class: 'bg-green-100 text-green-700' },
    { name: 'Pink', class: 'bg-pink-100 text-pink-700' },
    { name: 'Purple', class: 'bg-purple-100 text-purple-700' },
  ];

  const addNote = () => {
    if (!selectedDate || !noteContent) return;
    const newNote: CalendarNote = {
      id: generateId(),
      userId: '1',
      date: selectedDate,
      content: noteContent,
      color: noteColor
    };
    setNotes([...notes, newNote]);
    setNoteContent('');
    setShowNoteModal(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const renderDays = () => {
    const days = [];
    // Padding for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`pad-${i}`} className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20"></div>);
    }

    // Actual Days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const dayReminders = reminders.filter(r => r.date === dateStr);
      const dayHabits = habits.filter(h => h.completedDates.includes(dateStr));
      const dayNotes = notes.filter(n => n.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div 
          key={d} 
          onClick={() => { setSelectedDate(dateStr); setShowNoteModal(true); }}
          className={`p-2 md:p-4 border-t border-r border-gray-100 dark:border-gray-800 min-h-[100px] md:min-h-[140px] flex flex-col group transition-all cursor-pointer hover:bg-green-50/30 dark:hover:bg-green-900/10 relative ${isToday ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-black ${isToday ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`}>
              {d}
            </span>
            <Plus className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-1.5 overflow-hidden">
            {dayReminders.map(r => (
              <div key={r.id} className="text-[10px] p-1 bg-blue-500 text-white rounded-md truncate font-bold">
                {r.title}
              </div>
            ))}
            {dayHabits.map(h => (
              <div key={h.id} className="text-[10px] p-1 bg-purple-500 text-white rounded-md truncate font-bold">
                {h.name}
              </div>
            ))}
            {dayNotes.map(n => (
              <div key={n.id} className={`text-[10px] p-1 ${n.color} rounded-md truncate font-bold shadow-sm`}>
                {n.content}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-green-500" /> Calendar
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Track your life in the big picture.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"><ChevronLeft /></button>
          <span className="font-black min-w-[140px] text-center dark:text-white uppercase tracking-widest">{monthYearStr}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"><ChevronRight /></button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900/50 p-4">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em]">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l border-gray-100 dark:border-gray-800">
          {renderDays()}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest px-4">
        <div className="flex items-center gap-2 text-blue-500"><Circle className="w-3 h-3 fill-current" /> Reminders</div>
        <div className="flex items-center gap-2 text-purple-500"><Circle className="w-3 h-3 fill-current" /> Habits</div>
        <div className="flex items-center gap-2 text-yellow-500"><Circle className="w-3 h-3 fill-current" /> Notes</div>
        <div className="flex items-center gap-2 text-green-500"><Circle className="w-3 h-3 fill-current" /> Today</div>
      </div>

      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white">
                    <StickyNote className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black dark:text-white">Day Log: {selectedDate}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Add a Quick Entry</p>
                 </div>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"><X /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {notes.filter(n => n.date === selectedDate).map(note => (
                  <div key={note.id} className={`p-4 rounded-2xl flex justify-between items-center ${note.color} border border-black/5`}>
                    <p className="font-bold text-sm">{note.content}</p>
                    <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="p-2 hover:bg-black/5 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4 opacity-50" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">What's happening?</label>
                <textarea 
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="e.g. Birthday, Work Trip, Lunch Meeting..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-6 py-5 dark:text-white focus:ring-4 focus:ring-yellow-400/20 transition-all font-bold min-h-[120px]"
                />
              </div>

              <div className="flex gap-4">
                {colors.map(c => (
                  <button 
                    key={c.class}
                    onClick={() => setNoteColor(c.class)}
                    className={`w-10 h-10 rounded-xl transition-all border-4 ${noteColor === c.class ? 'border-gray-900 dark:border-white scale-110 shadow-lg' : 'border-transparent'} ${c.class.split(' ')[0]}`}
                  />
                ))}
              </div>

              <button 
                onClick={addNote}
                disabled={!noteContent}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-[24px] shadow-2xl transition-all active:scale-95 disabled:opacity-50 text-lg"
              >
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
