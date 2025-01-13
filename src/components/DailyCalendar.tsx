import React, { useState } from 'react';
import { Task, Submission } from '../types';
import { Switch } from './ui/switch';
import { cn } from '@/lib/utils';
import { TimeMarker } from './calendar/TimeMarker';
import { Plus, Check, X, Edit } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SubmissionHistory } from './SubmissionHistory';

interface DailyCalendarProps {
  tasks: Task[];
  activeTaskId: string | null;
  onTaskClick: (task: Task) => void;
  onAddTask: (hour: number) => void;
  onTaskUpdate: (updatedTask: Task) => void;
  submissions?: Submission[];
  onClearHistory?: () => void;
  isLeftAligned?: boolean;
  onAlignmentChange?: (value: boolean) => void;
}

export const DailyCalendar: React.FC<DailyCalendarProps> = ({
  tasks,
  activeTaskId,
  onTaskClick,
  onAddTask,
  onTaskUpdate,
  submissions = [],
  onClearHistory,
  isLeftAligned,
  onAlignmentChange,
}) => {
  const [focusMode, setFocusMode] = React.useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  // Calculate remaining time
  const remainingMinutes = 60 - currentMinute;
  const formatRemainingTime = (minutes: number) => {
    if (minutes === 60) return "1 hour";
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
  };

  const visibleHours = focusMode 
    ? [currentHour - 1, currentHour, currentHour + 1].filter(h => h >= 0 && h < 24)
    : hours;

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const handleTaskEdit = (task: Task, newTitle?: string) => {
    if (newTitle && newTitle.trim()) {
      const updatedTask = { ...task, title: newTitle.trim() };
      onTaskUpdate(updatedTask);
      setEditingTaskId(null);
      setEditValue('');
    } else {
      setEditingTaskId(task.id);
      setEditValue(task.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, task: Task) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editValue.trim()) {
        handleTaskEdit(task, editValue);
      }
    } else if (e.key === 'Escape') {
      setEditingTaskId(null);
      setEditValue('');
    }
  };

  const formatDateInFrench = () => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out">
      {/* Header with Focus Mode Switch */}
      <div className="sticky top-0 z-20 px-6 py-3 bg-white border-b border-gray-100">
        <div className="flex flex-col gap-3">
          {/* Date and Focus Mode Row */}
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-900 font-medium">
              {formatDateInFrench()}
            </span>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <span className={cn(
                "text-sm font-medium transition-colors",
                focusMode ? "text-blue-600" : "text-gray-500"
              )}>
                Mode Focus
              </span>
              <Switch
                checked={focusMode}
                onCheckedChange={setFocusMode}
                className={cn(
                  "data-[state=checked]:bg-blue-500",
                  "data-[state=unchecked]:bg-gray-200",
                  "data-[state=unchecked]:hover:bg-gray-300"
                )}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAlignmentChange(!isLeftAligned)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isLeftAligned ? "Center" : "Left Align"}
            </Button>
            <SubmissionHistory 
              submissions={submissions}
              onClearHistory={onClearHistory}
            />
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className={cn(
        "relative divide-y divide-gray-100 rounded-lg",
        focusMode ? "bg-gradient-to-b from-blue-50/50 to-white" : ""
      )}>
        <TimeMarker 
          currentHour={currentHour} 
          currentMinute={currentMinute} 
          focusMode={focusMode} 
        />
        
        {visibleHours.map((hour) => {
          const task = tasks.find((t) => t.hour === hour);
          const isCurrent = hour === currentHour;
          const isEditing = task && editingTaskId === task.id;
          
          return (
            <div key={hour} className={cn(
              "group relative transition-all duration-300",
              focusMode 
                ? cn(
                    "p-4 rounded-xl border border-gray-100/80",
                    isCurrent && "bg-blue-500 shadow-lg"
                  )
                : "flex items-center h-10 hover:bg-gray-50/50"
            )}>
              {/* Time Display */}
              <div className={cn(
                focusMode ? "flex items-center justify-between mb-2" : "w-16 px-3",
                isCurrent && focusMode && "text-white"
              )}>
                <div className={cn(
                  "text-gray-500",
                  focusMode ? "text-xl font-light" : "text-sm",
                  isCurrent && focusMode && "text-white font-medium"
                )}>
                  {formatHour(hour)}
                </div>
                {focusMode && isCurrent && (
                  <div className="text-sm font-medium text-white/90">
                    {formatRemainingTime(remainingMinutes)} remaining
                  </div>
                )}
              </div>

              {/* Task Content with updated styling */}
              <div className={cn(
                "flex-1",
                focusMode && isCurrent && "text-white"
              )}>
                {task ? (
                  isEditing ? (
                    <div className="flex items-center gap-2 px-3">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, task)}
                        className="flex-1 h-8 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                        autoFocus
                        placeholder="Task name..."
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (editValue.trim()) {
                              handleTaskEdit(task, editValue);
                            }
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTaskId(null);
                            setEditValue('');
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={cn(
                      "group/task flex items-center justify-between px-3 py-1 rounded-lg transition-all duration-200 ease-in-out",
                      focusMode && isCurrent 
                        ? "hover:bg-white/10" 
                        : "hover:bg-gray-50/80",
                      task.id === activeTaskId && !isCurrent && "bg-blue-50"
                    )}>
                      <button
                        onClick={() => onTaskClick(task)}
                        onDoubleClick={() => handleTaskEdit(task)}
                        className="flex-1 text-left"
                      >
                        <span className={cn(
                          "font-medium",
                          focusMode && isCurrent 
                            ? "text-white" 
                            : task.id === activeTaskId 
                              ? "text-blue-700" 
                              : "text-gray-900"
                        )}>
                          {task.title}
                        </span>
                      </button>
                      <div className="opacity-0 group-hover/task:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTaskEdit(task)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => onAddTask(hour)}
                    className="w-full h-full px-3 text-left text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add task</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};