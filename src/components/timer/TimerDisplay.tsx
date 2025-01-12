import React from 'react';
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const TimerDisplay = ({ timeLeft, isActive, onToggle, onReset }: TimerDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-3xl font-bold text-primary">{formatTime(timeLeft)}</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="w-10 h-10 rounded-full"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="w-10 h-10 rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};