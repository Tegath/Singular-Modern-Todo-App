import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings } from '@/components/Settings';
import { ReflectionForm } from '@/components/ReflectionForm';
import { useToast } from "@/components/ui/use-toast";
import { Task, Settings as SettingsType, Habit } from '@/types';
import { TaskEditor } from '@/components/TaskEditor';

const INITIAL_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Morning Review', 
    hour: 9, 
    completed: false, 
    content: '- [ ] Review emails\n- [ ] Check calendar\n- [ ] Plan day\n- [ ] Set priorities' 
  },
  { 
    id: '2', 
    title: 'Project Planning', 
    hour: 10, 
    completed: false, 
    content: '- [ ] Define scope\n- [ ] Set milestones\n- [ ] Assign tasks\n- [ ] Schedule review' 
  },
];

const INITIAL_SETTINGS: SettingsType = {
  workDuration: 30,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodoroCount: 4,
  autoStartBreaks: false,
  habits: [
    { id: '1', name: 'Exercise', completedDays: [] },
    { id: '2', name: 'Read', completedDays: [] },
    { id: '3', name: 'Meditate', completedDays: [] },
  ],
  dayStartQuestions: [
    'What are your main goals for today?',
    'How are you feeling?',
  ],
  dayEndQuestions: [
    'What did you accomplish today?',
    'What could have gone better?',
  ],
  darkMode: false,
  notifications: true,
  notificationSounds: {
    start: null,
    focus: null
  }
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(INITIAL_SETTINGS);
  const [habitCompletions, setHabitCompletions] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : settings.habits.map(h => ({
      ...h,
      completedDays: []
    }));
  });

  const handleTaskClick = (task: Task) => {
    setActiveTask(task);
  };

  const handleAddTask = (hour: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      hour,
      completed: false,
      content: '- [ ] Task item 1\n- [ ] Task item 2\n- [ ] Task item 3',
    };
    setTasks([...tasks, newTask]);
    setActiveTask(newTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    if (activeTask?.id === updatedTask.id) {
      setActiveTask(updatedTask);
    }
  };

  const handleToggleHabit = (habitId: string, date: string) => {
    setHabitCompletions(prev => {
      const completions = prev[habitId] || [];
      return {
        ...prev,
        [habitId]: completions.includes(date)
          ? completions.filter(d => d !== date)
          : [...completions, date],
      };
    });
  };

  const handleHabitsUpdate = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem('habits', JSON.stringify(newHabits));
  };

  return (
    <>
      <DashboardLayout
        tasks={tasks}
        activeTaskId={activeTask?.id || null}
        onTaskUpdate={handleUpdateTask}
        settings={settings}
        onSettingsUpdate={setSettings}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        className="max-w-screen-2xl mx-auto"
      />
      
      {showSettings && (
        <Settings
          settings={{...settings, habits}}
          onUpdate={(newSettings) => {
            setSettings(newSettings);
            setHabits(newSettings.habits.map(h => ({
              ...h,
              completedDays: habits.find(oldH => oldH.id === h.id)?.completedDays || []
            })));
          }}
        />
      )}
    </>
  );
};

export default Index;