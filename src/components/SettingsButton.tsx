import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Settings } from './Settings';
import { Settings as SettingsType } from '@/types';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface SettingsButtonProps {
  settings?: SettingsType;
  onSettingsUpdate?: (settings: SettingsType) => void;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  settings: parentSettings,
  onSettingsUpdate
}) => {
  const [localSettings, setLocalSettings] = React.useState<SettingsType>(() => {
    if (parentSettings) return parentSettings;
    const saved = localStorage.getItem('dashboardSettings');
    return saved ? JSON.parse(saved) : {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      pomodoroCount: 4,
      autoStartBreaks: false,
      habits: [],
      dayStartQuestions: [],
      dayEndQuestions: [],
      darkMode: false,
      notifications: true,
      notificationSounds: {
        start: null,
        focus: null
      }
    };
  });

  const handleSettingsUpdate = (newSettings: SettingsType) => {
    setLocalSettings(newSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
    if (onSettingsUpdate) {
      onSettingsUpdate(newSettings);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <Settings 
        settings={parentSettings || localSettings} 
        onUpdate={handleSettingsUpdate} 
      >
        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <Input
            value={localSettings.webhookUrl || ''}
            onChange={(e) => handleSettingsUpdate({ 
              ...localSettings, 
              webhookUrl: e.target.value 
            })}
            placeholder="Enter webhook URL (e.g., https://hook.eu1.make.com/...)"
          />
        </div>
      </Settings>
    </div>
  );
}; 