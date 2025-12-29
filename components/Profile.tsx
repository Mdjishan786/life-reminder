
import React, { useState } from 'react';
import { User, Reminder, Habit } from '../types';
import { Camera, Mail, Phone, Trash2, Edit3, Save, Activity, CheckCircle2 } from 'lucide-react';
import { getUsers, saveUsers, setActiveUserId } from '../store';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  reminders: Reminder[];
  habits: Habit[];
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, reminders, habits }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || ''
  });

  if (!user) return null;

  const handleSave = () => {
    const users = getUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...editData } : u);
    saveUsers(updatedUsers);
    setUser({ ...user, ...editData });
    setIsEditing(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const pic = ev.target?.result as string;
        const users = getUsers();
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, profilePic: pic } : u);
        saveUsers(updatedUsers);
        setUser({ ...user, profilePic: pic });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('CRITICAL: This will delete ALL your data permanently. Proceed?')) {
      const users = getUsers();
      saveUsers(users.filter(u => u.id !== user.id));
      localStorage.removeItem(`lifeflow_${user.id}_reminders`);
      localStorage.removeItem(`lifeflow_${user.id}_habits`);
      localStorage.removeItem(`lifeflow_${user.id}_settings`);
      setActiveUserId(null);
      navigate('/login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Header */}
      <div className="bg-white dark:bg-gray-800 p-10 rounded-[48px] shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-green-500 opacity-10"></div>
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-[40px] border-8 border-white dark:border-gray-700 shadow-2xl overflow-hidden bg-gray-50">
            <img 
              src={user.profilePic || `https://ui-avatars.com/api/?name=${user.fullName}&background=4CAF50&color=fff`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-1 right-1 bg-green-500 text-white p-2.5 rounded-2xl shadow-xl cursor-pointer hover:bg-green-600 transition-all hover:scale-110">
            <Camera className="w-5 h-5" />
            <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
          </label>
        </div>
        <h2 className="text-4xl font-black dark:text-white mb-2">{user.fullName}</h2>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
          Active Since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Account Details</h3>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${
                isEditing ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
              }`}
            >
              {isEditing ? <><Save className="w-4 h-4" /> SAVE</> : <><Edit3 className="w-4 h-4" /> EDIT</>}
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.fullName}
                  onChange={e => setEditData({...editData, fullName: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-6 py-4 dark:text-white font-bold"
                />
              ) : (
                <p className="text-xl font-bold dark:text-gray-200">{user.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Identity</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={editData.email}
                  onChange={e => setEditData({...editData, email: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-6 py-4 dark:text-white font-bold"
                />
              ) : (
                <div className="flex items-center gap-3 text-lg font-bold dark:text-gray-200"><Mail className="w-5 h-5 text-gray-400" /> {user.email}</div>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={editData.mobile}
                  onChange={e => setEditData({...editData, mobile: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl px-6 py-4 dark:text-white font-bold"
                />
              ) : (
                <div className="flex items-center gap-3 text-lg font-bold dark:text-gray-200"><Phone className="w-5 h-5 text-gray-400" /> +91 {user.mobile}</div>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Danger Zone */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-black mb-8 dark:text-white uppercase tracking-tight">Productivity Stats</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] border border-blue-100 dark:border-blue-800">
                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-blue-700/60 dark:text-blue-400/60 text-xs font-black uppercase mb-1">Total Tasks</p>
                <p className="text-3xl font-black dark:text-white">{reminders.length}</p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-[32px] border border-purple-100 dark:border-purple-800">
                <CheckCircle2 className="w-6 h-6 text-purple-500 mb-2" />
                <p className="text-purple-700/60 dark:text-purple-400/60 text-xs font-black uppercase mb-1">Total Habits</p>
                <p className="text-3xl font-black dark:text-white">{habits.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 p-10 rounded-[40px] border border-red-100 dark:border-red-900/30">
            <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
            <p className="text-sm text-red-500/80 mb-8 font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button 
              onClick={handleDeleteAccount}
              className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-200 active:scale-95"
            >
              <Trash2 className="w-5 h-5" /> DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
