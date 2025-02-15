import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PomodoroSettingsProps {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodoroCount: number;
  onSettingsChange: (key: string, value: number) => void;
}

export const PomodoroSettings = ({
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  pomodoroCount,
  onSettingsChange,
}: PomodoroSettingsProps) => {
  const handleWorkDurationChange = (value: number[]) => {
    onSettingsChange('workDuration', value[0]);
  };

  const handleShortBreakChange = (value: number[]) => {
    onSettingsChange('shortBreakDuration', value[0]);
  };

  const handleLongBreakChange = (value: number[]) => {
    onSettingsChange('longBreakDuration', value[0]);
  };

  const handlePomodoroCountChange = (value: number[]) => {
    onSettingsChange('pomodoroCount', value[0]);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Pomodoro Timer</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between">
            <Label>Work Duration</Label>
            <span className="text-sm text-gray-500">{workDuration} minutes</span>
          </div>
          <Slider
            value={[workDuration]}
            onValueChange={handleWorkDurationChange}
            max={90}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label>Short Break Duration</Label>
            <span className="text-sm text-gray-500">{shortBreakDuration} minutes</span>
          </div>
          <Slider
            value={[shortBreakDuration]}
            onValueChange={handleShortBreakChange}
            max={15}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label>Long Break Duration</Label>
            <span className="text-sm text-gray-500">{longBreakDuration} minutes</span>
          </div>
          <Slider
            value={[longBreakDuration]}
            onValueChange={handleLongBreakChange}
            max={30}
            min={5}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label>Pomodoros before Long Break</Label>
            <span className="text-sm text-gray-500">{pomodoroCount} pomodoros</span>
          </div>
          <Slider
            value={[pomodoroCount]}
            onValueChange={handlePomodoroCountChange}
            max={8}
            min={2}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};