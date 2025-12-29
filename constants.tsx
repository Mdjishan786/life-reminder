
import React from 'react';
import { 
  Heart, 
  Book, 
  Briefcase, 
  Sparkles, 
  User, 
  Settings,
  Droplets,
  Zap,
  Moon,
  Footprints,
  Clock,
  Activity
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Health: <Heart className="w-5 h-5" />,
  Study: <Book className="w-5 h-5" />,
  Work: <Briefcase className="w-5 h-5" />,
  Prayer: <Sparkles className="w-5 h-5" />,
  Personal: <User className="w-5 h-5" />,
  Custom: <Settings className="w-5 h-5" />,
};

export const HABIT_TEMPLATES = [
  { name: 'Morning Walk', icon: <Footprints className="text-green-500" /> },
  { name: 'Study Daily', icon: <Book className="text-purple-500" /> },
  { name: 'Sleep Early', icon: <Moon className="text-slate-500" /> },
  { name: 'Drink Water', icon: <Droplets className="text-blue-500" /> },
  { name: 'Exercise', icon: <Activity className="text-orange-500" /> },
  { name: 'Meditate', icon: <Sparkles className="text-indigo-500" /> },
  { name: 'Focus Time', icon: <Clock className="text-red-500" /> },
];

export const MOTIVATIONAL_QUOTES = [
  "Small steps lead to big changes.",
  "Your future is created by what you do today.",
  "Discipline is choosing between what you want now and what you want most.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The only bad workout is the one that didn't happen.",
  "Don't stop until you're proud.",
  "Great job! You are a star!",
  "Keep going, you're doing amazing!"
];

export const DEFAULT_ALARM_TONES = [
  { id: 'classic', name: 'Classic Alarm', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'gentle', name: 'Gentle Wakeup', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
  { id: 'bell', name: 'Morning Bell', url: 'https://assets.mixkit.co/active_storage/sfx/1014/1014-preview.mp3' },
  { id: 'nature', name: 'Forest Birds', url: 'https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3' },
];

// Added missing DEVELOPER_INFO export for ContactDev component
export const DEVELOPER_INFO = {
  name: 'Jishan',
  email: 'support@lifeflow.app',
  whatsapp: '+91 9876543210',
  location: 'Mumbai, India',
  responseTime: 'Under 24 hours'
};
