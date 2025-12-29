
import { User, UserSettings, Reminder, Habit, Category, Repeat } from './types';

const USERS_KEY = 'lifeflow_users';
const ACTIVE_USER_ID_KEY = 'lifeflow_active_user_id';

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getActiveUserId = (): string | null => {
  return localStorage.getItem(ACTIVE_USER_ID_KEY);
};

export const setActiveUserId = (id: string | null) => {
  if (id) localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  else localStorage.removeItem(ACTIVE_USER_ID_KEY);
};

export const getUserData = <T,>(key: string, userId: string, defaultValue: T): T => {
  const data = localStorage.getItem(`lifeflow_${userId}_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

export const saveUserData = <T,>(key: string, userId: string, data: T) => {
  localStorage.setItem(`lifeflow_${userId}_${key}`, JSON.stringify(data));
};

export const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
  kidsMode: false,
  seniorMode: false,
  notificationsEnabled: true,
  timeFormat24h: false,
  defaultAlarmTone: 'classic'
};

// Helper for unique IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);
