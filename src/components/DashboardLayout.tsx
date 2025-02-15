import React, { useState, useEffect } from 'react';
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
import { setCookie, getCookie } from '@/utils/cookies';
import { cn } from '@/lib/utils';
import { SubmissionScheduler } from '@/utils/scheduler';

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

// NEW: ObjectivesBox component that lets you enter your objectives and shows the "Project Death" countdown
const ObjectivesBox: React.FC = () => {
  const [objectives, setObjectives] = useState("");
  const [countdown, setCountdown] = useState<number>(calculateCountdown());

  function calculateCountdown() {
    const now = new Date();
    let targetYear = now.getFullYear();
    // Set target date as "April 31" (month index 3 is April; note that JS rolls over an invalid date)
    let target = new Date(targetYear, 3, 31);
    if (now > target) {
      target = new Date(targetYear + 1, 3, 31);
    }
    const diff = target.getTime() - now.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="objectives-box">
      <h2 className="text-xl font-bold mb-2">🎯 Objectives of the Day</h2>
      <textarea
        value={objectives}
        onChange={(e) => setObjectives(e.target.value)}
        placeholder="Write your objectives here..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        rows={4}
      />
      <div className="mt-4 p-3 bg-red-100 rounded-lg flex items-center justify-between">
        <span className="font-semibold text-red-700">💀 Project Death</span>
        <span className="text-red-800 text-lg">{countdown} days remaining</span>
      </div>
    </div>
  );
};

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
  const schedulerRef = React.useRef<SubmissionScheduler | null>(null);

  useEffect(() => {
    const savedSettings = getCookie('userSettings');
    if (savedSettings) {
      onSettingsUpdate(savedSettings);
    }
  }, []);

  // Initialize scheduler when component mounts
  useEffect(() => {
    if (settings.webhookUrl && !schedulerRef.current) {
      schedulerRef.current = new SubmissionScheduler(
        settings.webhookUrl,
        () => localSubmissions // This gives scheduler access to latest submissions
      );
    }

    return () => {
      // Cleanup on unmount
      schedulerRef.current?.stop();
    };
  }, []);

  // Update webhook URL if it changes in settings
  useEffect(() => {
    if (settings.webhookUrl && schedulerRef.current) {
      schedulerRef.current.updateWebhookUrl(settings.webhookUrl);
    }
  }, [settings.webhookUrl]);

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

  const handleSettingsUpdate = (newSettings: SettingsType) => {
    setCookie('userSettings', newSettings);
    onSettingsUpdate(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className={`flex max-w-[1200px] ${isLeftAligned ? 'ml-6' : 'mx-auto'} p-6 gap-6 ${className}`}>
        {/* Left Sidebar - Calendar */}
        <div className="w-[300px]">
          <div className="sticky top-6 space-y-4">
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
            
            {/* Objectives Box added just below the DailyCalendar */}
            <div className="dashboard-card">
              <ObjectivesBox />
            </div>
            
            <SubmissionHistory 
              submissions={localSubmissions}
              onClearHistory={() => setLocalSubmissions([])}
              webhookUrl={settings.webhookUrl}
            />
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
              onSettingsUpdate={handleSettingsUpdate}
              onOpenDayStart={() => setIsDayStartOpen(true)}
              onOpenDayEnd={() => setIsDayEndOpen(true)}
            />
          </div>

          {/* Active Task Editor */}
          {activeTask && (
            <div className="dashboard-card relative">
              <TaskEditor
                task={activeTask}
                onSave={(updatedTask) => onTaskUpdate(updatedTask)}
              />
            </div>
          )}

          {/* Habit Tracker */}
          {settings.habits && settings.habits.length > 0 && (
            <div className="dashboard-card">
              <HabitTracker 
                habits={settings.habits}
                onHabitUpdate={(newHabits) => {
                  handleSettingsUpdate({
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
            onSettingsUpdate={handleSettingsUpdate}
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