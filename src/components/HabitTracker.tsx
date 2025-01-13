import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playSound } from '@/utils/playSound';

interface Habit {
  id: string;
  name: string;
  completedDays: number[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const HabitTracker: React.FC<{
  habits: Habit[];
  onHabitUpdate: (habits: Habit[]) => void;
}> = ({ habits, onHabitUpdate }) => {
  console.log('HabitTracker rendered with habits:', habits);

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    const newHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleting = !habit.completedDays.includes(dayIndex);
        if (isCompleting) {
          playSound('notification.mp3');
        }
        const newCompletedDays = isCompleting
          ? [...habit.completedDays, dayIndex]
          : habit.completedDays.filter(d => d !== dayIndex);
        return { ...habit, completedDays: newCompletedDays };
      }
      return habit;
    });
    onHabitUpdate(newHabits);
  };

  const getCurrentDayIndex = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday-based index
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100/50 p-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Weekly Habits</h2>
          <span className="text-sm text-gray-500">Week {new Date().getWeek()}</span>
        </div>
        
        <div className="min-w-[800px] w-full">
          <div className="grid grid-cols-[180px_repeat(7,1fr)_80px] gap-4">
            {/* Days of week header */}
            <div className="text-sm font-medium text-gray-500">Habits</div>
            {DAYS.map((day, index) => (
              <div 
                key={day}
                className={cn(
                  "text-sm font-medium flex justify-center items-center whitespace-nowrap",
                  index === getCurrentDayIndex() ? "text-blue-600" : "text-gray-500"
                )}
              >
                {day}
              </div>
            ))}
            <div /> {/* Empty cell for completion count column */}

            {/* Habits grid */}
            {habits.map(habit => (
              <div key={habit.id} className="group contents">
                <div className="text-sm font-medium text-gray-700">{habit.name}</div>
                {DAYS.map((_, index) => {
                  const isCompleted = habit.completedDays.includes(index);
                  const isToday = index === getCurrentDayIndex();
                  return (
                    <div key={index} className="flex justify-center items-center">
                      <button
                        onClick={() => toggleHabitDay(habit.id, index)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all duration-200",
                          "flex items-center justify-center",
                          "border-2",
                          isCompleted 
                            ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600" 
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                          isToday && !isCompleted && "border-blue-500/50"
                        )}
                      >
                        {isCompleted && <Check className="w-5 h-5" />}
                      </button>
                    </div>
                  );
                })}
                <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity pl-2 flex items-center">
                  {habit.completedDays.length}/7
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function(): number {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
};