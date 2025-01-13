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