export interface User {
  id?: number;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  timezone?: string;
  avatarUrl?: string;
  role?: 'USER' | 'ADMIN' | 'PREMIUM';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string | null;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  timezone?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  timezone?: string;
  avatarUrl?: string;
}

export interface Event {
  id: number;
  userId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  color: string;
  location: string;
  recurring: boolean;
  categoryIds: number[];
  categoryNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  color?: string;
  location?: string;
  recurring?: boolean;
  categoryIds?: number[];
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  description: string;
  isDefault: boolean;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

export interface Agent {
  name: string;
  status: string;
  avatar: string;
  active: boolean;
}

export interface Message {
  id: number | string;
  sender: string;
  role: string;
  text: string;
  time: string;
  isOwn: boolean;
  avatar: string;
}

export interface ConsoleMessage {
  id: string;
  agent: 'user' | 'assistant';
  agentColor?: string;
  text: string;
  timestamp: Date | string;
  type?: 'info' | 'success' | 'error' | 'warn';
}