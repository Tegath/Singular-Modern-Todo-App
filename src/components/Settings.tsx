import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import { Settings as SettingsType } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { HabitSettings } from './settings/HabitSettings';
import { PomodoroSettings } from './settings/PomodoroSettings';
import { QuestionSettings } from './settings/QuestionSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { useToast } from './ui/use-toast';

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (settings: SettingsType) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const { toast } = useToast();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onUpdate(localSettings);
    setIsOpen(false);
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pomodoro" className="mt-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <TabsContent value="pomodoro">
              <PomodoroSettings
                workDuration={localSettings.workDuration}
                shortBreakDuration={localSettings.shortBreakDuration}
                longBreakDuration={localSettings.longBreakDuration}
                pomodoroCount={localSettings.pomodoroCount}
                onSettingsChange={handleSettingChange}
              />
            </TabsContent>

            <TabsContent value="habits">
              <HabitSettings
                habits={localSettings.habits}
                onHabitsChange={(habits) => handleSettingChange('habits', habits)}
              />
            </TabsContent>

            <TabsContent value="questions">
              <div className="space-y-6">
                <QuestionSettings
                  questions={localSettings.dayStartQuestions}
                  onQuestionsChange={(questions) => handleSettingChange('dayStartQuestions', questions)}
                />
                <QuestionSettings
                  questions={localSettings.dayEndQuestions}
                  onQuestionsChange={(questions) => handleSettingChange('dayEndQuestions', questions)}
                />
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings
                onSoundUpload={(type, file) => {
                  handleSettingChange('notificationSounds', {
                    ...localSettings.notificationSounds,
                    [type]: URL.createObjectURL(file)
                  });
                }}
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setLocalSettings(settings);
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};