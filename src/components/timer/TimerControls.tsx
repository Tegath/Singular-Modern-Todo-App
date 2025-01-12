import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const TimerControls = ({ isActive, onToggle, onReset }: TimerControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="w-12 h-12 rounded-full"
      >
        {isActive ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="w-12 h-12 rounded-full"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
};