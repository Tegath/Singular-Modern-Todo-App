import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { playSound } from '@/utils/playSound';

interface TaskCheckboxItemProps {
  label: string;
  checked: boolean;
  indent?: string;
  isNextUnchecked?: boolean;
  completionTime?: number;
  onCheckedChange: (checked: boolean) => void;
  onLabelChange: (label: string) => void;
}

export const TaskCheckboxItem = ({ 
  label, 
  checked, 
  indent = '', 
  isNextUnchecked = false,
  completionTime,
  onCheckedChange, 
  onLabelChange 
}: TaskCheckboxItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      playSound('notification.mp3');
    }
    onCheckedChange(checked);
  };

  return (
    <div 
      className={`flex items-start gap-2 py-1.5 -mx-2 px-2 rounded-lg 
        hover:bg-gray-50/80 transition-all duration-200`}
      style={{ marginLeft: indent.length * 8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheckboxChange}
        className={`mt-1 transition-all duration-200 ${
          checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        }`}
      />
      <div className="flex-1 flex items-center justify-between">
        <div className={`
          px-2 py-0.5 rounded transition-all duration-200
          ${isNextUnchecked && !checked ? 'bg-blue-500 text-white font-medium' : ''}
        `}>
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            className={`bg-transparent border-none focus:outline-none focus:ring-1 
              focus:ring-blue-400/20 rounded transition-all duration-200
              ${checked ? 'text-gray-400 line-through' : 'text-gray-700'}
              ${isHovered ? 'text-gray-900' : ''}`}
          />
        </div>
        {checked && completionTime && (
          <span className="text-[12px] text-blue-500 italic font-medium whitespace-nowrap ml-auto pl-16">
            {completionTime} minutes
          </span>
        )}
      </div>
    </div>
  );
};