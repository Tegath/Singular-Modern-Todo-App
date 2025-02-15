import React, { useState, useEffect, useCallback } from 'react';
import { playSound, playBackgroundSound } from '@/utils/sounds';
import { PostPomodoroForm } from './pomodoro/PostPomodoroForm';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ReflectionForm } from './ReflectionForm';
import { Submission, Task } from '@/types';

interface PomodoroTimerProps {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  totalCycles: number;
  autoStartBreaks: boolean;
  onComplete: (answers: any) => void;
  notificationSounds?: {
    start: string | null;
    focus: string | null;
  };
  onAutoStartChange: (value: boolean) => void;
  activeTask?: Partial<Task>;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  totalCycles,
  autoStartBreaks,
  onComplete,
  notificationSounds,
  onAutoStartChange,
  activeTask,
}) => {
  // Use a ref to track if this is the initial mount
  const [timeLeft, setTimeLeft] = useState<number>(() => workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [playingBrownNoise, setPlayingBrownNoise] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isReflectionFormOpen, setIsReflectionFormOpen] = useState(false);

  // Update timer whenever duration changes
  useEffect(() => {
    setTimeLeft(workDuration * 60);
  }, [workDuration]);

  // Reset cycle count if it exceeds the new total
  useEffect(() => {
    if (currentCycle > totalCycles) {
      setCurrentCycle(1);
    }
  }, [totalCycles, currentCycle]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setMode('work');
    setCurrentCycle(1);
    setTimeLeft(workDuration * 60);
  }, [workDuration]);

  const toggleTimer = () => {
    if (!isRunning) {
      playSound('start', notificationSounds?.start || undefined);
    }
    setIsRunning(!isRunning);
  };

  const skipPhase = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode(currentCycle === totalCycles ? 'longBreak' : 'shortBreak');
      setTimeLeft((currentCycle === totalCycles ? longBreakDuration : shortBreakDuration) * 60);
    } else {
      if (mode === 'longBreak') {
        setCurrentCycle(1);
      } else {
        setCurrentCycle(c => c + 1);
      }
      setMode('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const questions = [
    "Qu'as-tu accompli pendant cette session ?",
    "Quels obstacles as-tu rencontrés ?",
    "Comment pourrais-tu améliorer ta prochaine session ?",
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      
      if (mode === 'work') {
        playSound('complete', notificationSounds?.focus || undefined);
        setIsReflectionFormOpen(true);
        
        if (currentCycle === totalCycles) {
          setMode('longBreak');
          setTimeLeft(longBreakDuration * 60);
        } else {
          setMode('shortBreak');
          setTimeLeft(shortBreakDuration * 60);
        }
        if (autoStartBreaks) {
          setIsRunning(true);
        }
      } else {
        // When break is complete
        playSound('start', notificationSounds?.start || undefined);
        if (mode === 'longBreak') {
          setCurrentCycle(1);
        } else {
          setCurrentCycle(c => c + 1);
        }
        setMode('work');
        setTimeLeft(workDuration * 60);
        // Auto-start work session if autoStartBreaks is enabled
        if (autoStartBreaks) {
          setIsRunning(true);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, currentCycle, totalCycles, workDuration, shortBreakDuration, longBreakDuration, autoStartBreaks, notificationSounds]);

  // Add effect to handle background sound
  useEffect(() => {
    if (isRunning && mode === 'work') {
      playBackgroundSound(true);
      setPlayingBrownNoise(true);
    } else {
      playBackgroundSound(false);
      setPlayingBrownNoise(false);
    }

    return () => {
      playBackgroundSound(false);
    };
  }, [isRunning, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleFormSubmit = (answers: string[]) => {
    // Create a submission record
    const submission = {
      id: Date.now().toString(),
      title: activeTask?.title || 'Focus Session',
      content: answers,
      timestamp: new Date().toISOString(),
      duration: workDuration,
      completed: true,
      questions: questions // Your questions array
    };

    onComplete(submission); // Pass the full submission object
    setIsPostFormOpen(false);
  };

  const handleReflectionSubmit = (answers: Record<string, string>) => {
    const submission: Submission = {
      id: crypto.randomUUID(),
      title: activeTask?.title || 'Focus Session',
      content: Object.values(answers),
      timestamp: new Date().toISOString(),
      duration: workDuration,
      completed: true,
      questions: [
        "Qu'as-tu accompli pendant cette session ?",
        "Quels obstacles as-tu rencontrés ?",
        "Comment pourrais-tu améliorer ta prochaine session ?"
      ],
      taskContent: activeTask?.content
    };
    onComplete(submission);
    setIsReflectionFormOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100/50 p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Focus Time</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoStartBreaks}
                  onCheckedChange={onAutoStartChange}
                  className={cn(
                    "data-[state=checked]:bg-blue-500",
                    "data-[state=unchecked]:bg-gray-200",
                    "data-[state=unchecked]:hover:bg-gray-300"
                  )}
                />
                <span className={cn(
                  "text-sm font-medium",
                  autoStartBreaks ? "text-blue-600" : "text-gray-500"
                )}>
                  Auto-start breaks
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {currentCycle}/{totalCycles}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-light">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {mode === 'work' ? 'Work' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={toggleTimer}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={skipPhase}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Skip
            </button>
            <button
              onClick={resetTimer}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setPlayingBrownNoise(!playingBrownNoise);
                playBackgroundSound(!playingBrownNoise);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                playingBrownNoise 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎵 Brown Noise
            </button>
          </div>
        </div>
      </div>

      <PostPomodoroForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        questions={questions}
        onSubmit={handleFormSubmit}
        activeTask={activeTask}
      />

      {isReflectionFormOpen && (
        <ReflectionForm
          questions={[
            { id: "1", text: "Qu'as-tu accompli pendant cette session ?" },
            { id: "2", text: "Quels obstacles as-tu rencontrés ?" },
            { id: "3", text: "Comment pourrais-tu améliorer ta prochaine session ?" }
          ]}
          onSubmit={handleReflectionSubmit}
          onClose={() => setIsReflectionFormOpen(false)}
        />
      )}
    </>
  );
};