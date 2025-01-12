import React from 'react';

interface TimerStateProps {
  isWorkPhase: boolean;
  cycle: number;
  totalCycles: number;
}

export const TimerState = ({ isWorkPhase, cycle, totalCycles }: TimerStateProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600">
        {isWorkPhase ? 'Work Time' : 'Break Time'}
      </span>
      <span className="text-sm text-gray-400">
        Cycle {cycle}/{totalCycles}
      </span>
    </div>
  );
};