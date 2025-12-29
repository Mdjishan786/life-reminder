
export enum Category {
  Health = 'Health',
  Study = 'Study',
  Work = 'Work',
  Prayer = 'Prayer',
  Personal = 'Personal',
  Custom = 'Custom'
}

export enum Repeat {
  Once = 'Once',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  profilePic?: string;
  createdAt: number;
}

export interface UserSettings {
  darkMode: boolean;
  kidsMode: boolean;
  seniorMode: boolean;
  notificationsEnabled: boolean;
  timeFormat24h: boolean;
  defaultAlarmTone: string;
  customAlarmSound?: string;
  focusAlarmSound?: string; // New: Custom sound for focus timer
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: Category;
  repeat: Repeat;
  completed: boolean;
  lastTriggered?: string;
  alarmSound?: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  days: number[]; // 0-6 (Sun-Sat)
  completedDates: string[]; 
  logs: Record<string, number>; 
  createdAt: string;
  icon: string;
  dailyGoal: number; 
  goal: number; 
  color: string; // User selected hex or class
}

export interface CalendarNote {
  id: string;
  userId: string;
  date: string; 
  content: string;
  color: string;
}

export interface AppState {
  currentUser: User | null;
  reminders: Reminder[];
  habits: Habit[];
  notes: CalendarNote[];
  settings: UserSettings;
}
