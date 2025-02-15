export interface Task {
  id: string;
  title: string;
  hour: number;
  completed: boolean;
  content: string;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: number[];
}

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodoroCount: number;
  autoStartBreaks: boolean;
  habits: Habit[];
  dayStartQuestions: string[];
  dayEndQuestions: string[];
  darkMode: boolean;
  notifications: boolean;
  notificationSounds?: {
    start: string | null;
    focus: string | null;
  };
  webhookUrl?: 'https://hook.eu2.make.com/uo3bo9yqrn6b8zcwl65i0pb3v3gt1gne'; // Your webhook URL goes here (e.g., 'https://hook.eu1.make.com/abc123...')
}

export interface Submission {
  id: string;
  title: string;
  content: string[];
  timestamp: string;
  duration: number;
  completed: boolean;
  questions: string[];
  taskContent?: string;
}