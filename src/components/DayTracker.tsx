import React from 'react';
import { Settings as SettingsType } from '../types'; 
import { Settings } from './Settings';
import { Button } from './ui/button';

interface Reflection {
  date: string;
  type: 'morning' | 'evening';
  answers: Record<string, string>;
}

interface DayTrackerProps {
  settings: SettingsType;
  onSettingsUpdate: (newSettings: SettingsType) => void;
  onOpenDayStart: () => void;
  onOpenDayEnd: () => void;
}

export const DayTracker = ({ settings, onSettingsUpdate, onOpenDayStart, onOpenDayEnd }: DayTrackerProps) => {
  const [completedReflections, setCompletedReflections] = React.useState<Reflection[]>([]);

  const isMorningCompleted = completedReflections.some(
    r => r.type === 'morning' && new Date(r.date).toDateString() === new Date().toDateString()
  );
  const isEveningCompleted = completedReflections.some(
    r => r.type === 'evening' && new Date(r.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100/50 p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Day Tracking</h2>
        <Settings settings={settings} onUpdate={onSettingsUpdate} />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 place-content-center">
        <Button 
          onClick={onOpenDayStart}
          className={`flex flex-col items-center justify-center p-6 rounded-lg border h-full
            ${isMorningCompleted 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'border-gray-200 hover:bg-gray-50'
            }`}
        >
          <span className="text-sm">Morning reflection</span>
          {isMorningCompleted && (
            <span className="text-xs mt-1 text-blue-500">Completed</span>
          )}
        </Button>
        <Button 
          onClick={onOpenDayEnd}
          className={`flex flex-col items-center justify-center p-6 rounded-lg border h-full
            ${isEveningCompleted 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'border-gray-200 hover:bg-gray-50'
            }`}
        >
          <span className="text-sm">Evening reflection</span>
          {isEveningCompleted && (
            <span className="text-xs mt-1 text-blue-500">Completed</span>
          )}
        </Button>
      </div>

      <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-6">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out" 
          style={{ 
            width: `${((isMorningCompleted ? 1 : 0) + (isEveningCompleted ? 1 : 0)) * 50}%` 
          }} 
        />
      </div>
    </div>
  );
}; 