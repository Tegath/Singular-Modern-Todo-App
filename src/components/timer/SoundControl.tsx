import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2 } from 'lucide-react';

interface SoundControlProps {
  onSoundFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SoundControl = ({ onSoundFileChange }: SoundControlProps) => {
  return (
    <div className="relative">
      <input
        type="file"
        accept="audio/*"
        onChange={onSoundFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-full"
      >
        <Volume2 className="w-4 h-4" />
      </Button>
    </div>
  );
};