import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NotificationSettingsProps {
  onSoundUpload: (type: 'start' | 'focus', file: File) => void;
}

export const NotificationSettings = ({ onSoundUpload }: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Notification Sounds</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Sound</Label>
          <Input 
            type="file" 
            accept="audio/*" 
            className="mt-1"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSoundUpload('start', file);
            }}
          />
        </div>
        <div>
          <Label>Focus Sound</Label>
          <Input 
            type="file" 
            accept="audio/*" 
            className="mt-1"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSoundUpload('focus', file);
            }}
          />
        </div>
      </div>
    </div>
  );
};