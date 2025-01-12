import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";

interface TaskTitleProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export const TaskTitle = ({ title, onTitleChange }: TaskTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const handleSave = () => {
    if (editValue.trim()) {
      onTitleChange(editValue.trim());
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <div className="flex items-center gap-2 group/title animate-in fade-in-0 duration-200">
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') {
            setEditValue(title);
            setIsEditing(false);
          }
        }}
        className="text-lg font-medium w-full bg-transparent border-blue-200/50 focus:border-blue-400 
          focus:ring-blue-400/20 transition-all duration-200"
        autoFocus
      />
    </div>
  ) : (
    <div className="group/title cursor-pointer" onClick={() => setIsEditing(true)}>
      <h2 className="text-lg font-medium text-gray-900 group-hover/title:text-blue-600 transition-colors duration-200">
        {title}
        <span className="ml-2 opacity-0 group-hover/title:opacity-100 text-blue-400 text-sm font-normal transition-opacity duration-200">
          Click to edit
        </span>
      </h2>
    </div>
  );
};