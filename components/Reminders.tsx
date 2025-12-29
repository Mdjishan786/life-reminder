
import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Calendar as CalendarIcon,
  Tag,
  Repeat as RepeatIcon,
  X
} from 'lucide-react';
import { Reminder, Category, Repeat } from '../types';
import { generateId } from '../store';
import { CATEGORY_ICONS } from '../constants';

interface RemindersProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  settings: any;
}

const Reminders: React.FC<RemindersProps> = ({ reminders, setReminders, settings }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    category: Category.Personal,
    repeat: Repeat.Once
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newReminder: Reminder = {
      ...formData,
      id: generateId(),
      userId: '1', // Handled by App context usually
      completed: false
    };

    setReminders([...reminders, newReminder]);
    setShowAdd(false);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      category: Category.Personal,
      repeat: Repeat.Once
    });
  };

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black dark:text-white">Reminders</h2>
          <p className="text-gray-500 dark:text-gray-400">Set tasks and never forget them.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-green-500/30 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(reminder => (
          <div 
            key={reminder.id} 
            className={`bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 transition-all ${reminder.completed ? 'border-gray-50 dark:border-gray-700 opacity-60' : 'border-transparent hover:border-green-500'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${reminder.completed ? 'bg-gray-100 dark:bg-gray-700' : 'bg-green-50 dark:bg-green-900/20 text-green-500'}`}>
                {CATEGORY_ICONS[reminder.category]}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleComplete(reminder.id)}
                  className={`p-2 rounded-xl transition-colors ${reminder.completed ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 bg-gray-50 dark:bg-gray-700'}`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className={`text-xl font-bold mb-1 dark:text-white ${reminder.completed ? 'line-through text-gray-400' : ''}`}>{reminder.title}</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4 line-clamp-2">{reminder.description || 'No description'}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 w-fit px-3 py-1.5 rounded-full">
                <CalendarIcon className="w-3.5 h-3.5" /> {reminder.date}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 w-fit px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" /> {reminder.time}
              </div>
              {reminder.repeat !== Repeat.Once && (
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1.5 rounded-full">
                  <RepeatIcon className="w-3.5 h-3.5" /> {reminder.repeat}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black dark:text-white">Create Reminder</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-5 py-4 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="Drink Water, Study Math..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-5 py-4 dark:text-white focus:ring-2 focus:ring-green-500 transition-all h-24"
                  placeholder="Extra details (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-5 py-4 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-5 py-4 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-5 py-4 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Repeat</label>
                  <select 
                    value={formData.repeat}
                    onChange={e => setFormData({...formData, repeat: e.target.value as Repeat})}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-5 py-4 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    {Object.values(Repeat).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl mt-4 shadow-xl shadow-green-200 transition-all active:scale-95"
              >
                Create Reminder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
