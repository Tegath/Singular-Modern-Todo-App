export interface Task {
  id: string;
  title: string;
  content: string;
  hour: number;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
} 