import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCheckboxItemProps {
  label: string;
  checked: boolean;
  indent?: string;
  onCheckedChange: (checked: boolean) => void;
  onLabelChange: (label: string) => void;
}

export const TaskCheckboxItem = ({ 
  label, 
  checked, 
  indent = '', 
  onCheckedChange, 
  onLabelChange 
}: TaskCheckboxItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-start gap-2 py-1.5 -mx-2 px-2 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
      style={{ marginLeft: indent.length * 8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(!!checked)}
        className={`mt-1 transition-all duration-200 ${
          checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        }`}
      />
      <input
        type="text"
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
        className={`flex-1 bg-transparent border-none focus:outline-none focus:ring-1 
          focus:ring-blue-400/20 rounded px-1 transition-all duration-200
          ${checked ? 'text-gray-400 line-through' : 'text-gray-700'}
          ${isHovered ? 'text-gray-900' : ''}`}
      />
    </div>
  );
};