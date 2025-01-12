import React, { useState } from 'react';
import { Task, Habit, Settings as SettingsType, Submission } from '@/types';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskEditor } from '@/components/TaskEditor';
import { HabitTracker } from '@/components/HabitTracker';
import { DailyCalendar } from '@/components/DailyCalendar';
import { SettingsButton } from '@/components/SettingsButton';
import { DayTracker } from '@/components/DayTracker';
import { DayStartForm } from '@/components/forms/DayStartForm';
import { DayEndForm } from '@/components/forms/DayEndForm';
import { SubmissionHistory } from '@/components/SubmissionHistory';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface DashboardLayoutProps {
  tasks: Task[];
  activeTaskId: string | null;
  onTaskUpdate: (updatedTask: Task) => void;
  settings: SettingsType;
  onSettingsUpdate: (settings: SettingsType) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (hour: number) => void;
  submissions?: Submission[];
  className?: string;
  children?: React.ReactNode;
  onSubmissionAdd?: (submission: Submission) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  tasks = [],
  activeTaskId,
  onTaskUpdate,
  settings,
  onSettingsUpdate,
  onTaskClick,
  onAddTask,
  submissions = [],
  className,
  children,
  onSubmissionAdd,
}) => {
  const activeTask = tasks.find((task) => task.id === activeTaskId);
  const [isDayStartOpen, setIsDayStartOpen] = useState(false);
  const [isDayEndOpen, setIsDayEndOpen] = useState(false);
  const [isLeftAligned, setIsLeftAligned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>(submissions || []);

  const handleAutoStartChange = (value: boolean) => {
    onSettingsUpdate({
      ...settings,
      autoStartBreaks: value
    });
  };

  const handlePomodoroComplete = (submission: Submission) => {
    const updatedSubmissions = [submission, ...localSubmissions];
    setLocalSubmissions(updatedSubmissions);
    
    if (onSubmissionAdd) {
      onSubmissionAdd(submission);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className={`flex max-w-[1200px] ${isLeftAligned ? 'ml-6' : 'mx-auto'} p-6 gap-6 ${className}`}>
        {/* Left Sidebar - Calendar */}
        <div className="w-[300px]">
          <div className="sticky top-6">
            <div className="dashboard-card overflow-hidden">
              <DailyCalendar
                tasks={tasks}
                activeTaskId={activeTaskId}
                onTaskClick={onTaskClick}
                onAddTask={onAddTask}
                onTaskUpdate={onTaskUpdate}
                submissions={localSubmissions}
                onClearHistory={() => setLocalSubmissions([])}
                isLeftAligned={isLeftAligned}
                onAlignmentChange={setIsLeftAligned}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-4">
          {/* Top Row - Pomodoro and Day Tracking */}
          <div className="grid grid-cols-[1fr_300px] gap-4">
            <PomodoroTimer
              workDuration={settings.workDuration}
              shortBreakDuration={settings.shortBreakDuration}
              longBreakDuration={settings.longBreakDuration}
              totalCycles={settings.pomodoroCount}
              autoStartBreaks={settings.autoStartBreaks}
              notificationSounds={settings.notificationSounds}
              activeTask={activeTask}
              onComplete={handlePomodoroComplete}
              onAutoStartChange={handleAutoStartChange}
            />

            <DayTracker
              settings={settings}
              onSettingsUpdate={onSettingsUpdate}
              onOpenDayStart={() => setIsDayStartOpen(true)}
              onOpenDayEnd={() => setIsDayEndOpen(true)}
            />
          </div>

          {/* Active Task Editor */}
          {activeTask && (
            <div className="dashboard-card relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
              <TaskEditor
                task={activeTask}
                onSave={(updatedTask) => onTaskUpdate(updatedTask)}
                isEditing={isEditing}
                onEditingChange={setIsEditing}
              />
            </div>
          )}

          {/* Habit Tracker */}
          {settings.habits && settings.habits.length > 0 && (
            <div className="dashboard-card">
              <HabitTracker 
                habits={settings.habits}
                onHabitUpdate={(newHabits) => {
                  onSettingsUpdate({
                    ...settings,
                    habits: newHabits
                  });
                }}
              />
            </div>
          )}
        </div>

        {/* Settings Button - Floating */}
        <div className="fixed bottom-6 right-6">
          <SettingsButton
            settings={settings}
            onSettingsUpdate={onSettingsUpdate}
          />
        </div>

        {/* Forms remain the same */}
        <DayStartForm
          isOpen={isDayStartOpen}
          onClose={() => setIsDayStartOpen(false)}
          onSubmit={(answers) => {
            console.log('Day Start Answers:', answers);
            setIsDayStartOpen(false);
          }}
        />
        <DayEndForm
          isOpen={isDayEndOpen}
          onClose={() => setIsDayEndOpen(false)}
          onSubmit={(answers) => {
            console.log('Day End Answers:', answers);
            setIsDayEndOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;