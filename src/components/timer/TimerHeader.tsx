import React from 'react';
import { Timer } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface TimerHeaderProps {
  cycle: number;
  totalCycles: number;
  duration: number;
  isWorkPhase: boolean;
  onDurationChange: (value: number[]) => void;
}

export const TimerHeader = ({ 
  cycle, 
  totalCycles, 
  duration, 
  isWorkPhase,
  onDurationChange 
}: TimerHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-primary-dark flex items-center gap-2">
        <Timer className="w-5 h-5" />
        {isWorkPhase ? 'Work Time' : 'Break Time'}
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Cycle {cycle}/{totalCycles}
        </span>
        <div className="flex items-center gap-2">
          <Slider
            value={[duration]}
            onValueChange={onDurationChange}
            min={1}
            max={90}
            step={1}
            className="w-24"
          />
          <span className="text-sm text-gray-500 w-16">{duration}min</span>
        </div>
      </div>
    </div>
  );
};