export interface Task {
  id: string;
  title: string;
  hour: number;
  completed: boolean;
  content: string;
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
}

export interface Submission {
  id: string;
  title: string;
  content: string[];
  timestamp: string;
  duration: number;
  completed: boolean;
  questions: string[];
}