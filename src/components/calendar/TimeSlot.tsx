import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus } from 'lucide-react';
import { Task } from '@/types';

interface TimeSlotProps {
  hour: number;
  task?: Task;
  currentHour: number;
  isEditing: boolean;
  editingTitle: string;
  isActive?: boolean;
  onEditClick: (taskId: string, e: React.MouseEvent) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (hour: number) => void;
  onTitleChange: (value: string) => void;
  onTitleUpdate: (taskId: string, title: string) => void;
  onKeyDown: (e: React.KeyboardEvent, taskId: string) => void;
}

export const TimeSlot = ({
  hour,
  task,
  currentHour,
  isEditing,
  editingTitle,
  isActive,
  onEditClick,
  onTaskClick,
  onAddTask,
  onTitleChange,
  onTitleUpdate,
  onKeyDown
}: TimeSlotProps) => {
  const isPast = hour < currentHour;
  const isCurrent = hour === currentHour;

  return (
    <div
      className={`
        flex items-center p-3 rounded-lg transition-all duration-200 relative group
        ${task ? 'hover:bg-primary/5' : ''}
        ${isPast ? 'opacity-50' : ''}
        ${isActive ? 'bg-primary/10' : ''}
        ${isCurrent ? 'bg-blue-50/50' : ''}
      `}
    >
      <span className="w-16 text-sm font-medium select-none" style={{ color: isCurrent ? '#007AFF' : '#94A3B8' }}>
        {hour.toString().padStart(2, '0')}:00
      </span>
      
      {task ? (
        <div 
          className="flex-1 ml-4 flex justify-between items-center cursor-pointer"
          onClick={() => !isEditing && onTaskClick(task)}
        >
          {isEditing ? (
            <Input
              value={editingTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => onKeyDown(e, task.id)}
              onBlur={() => onTitleUpdate(task.id, editingTitle)}
              autoFocus
              className="flex-1 mr-2 bg-white/80 border-primary/20 focus:border-primary rounded-lg"
            />
          ) : (
            <>
              <div className="flex items-center space-x-2 flex-1">
                <span className={`
                  text-sm transition-colors
                  ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}
                `}>
                  {task.title}
                </span>
                {task.content && (
                  <span className="text-xs text-gray-400">
                    {task.content.split('\n').length} items
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={(e) => onEditClick(task.id, e)}
              >
                <Edit2 className="w-4 h-4 text-gray-400" />
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 ml-4 flex justify-between items-center">
          <span className="text-gray-300 text-sm">Available</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={() => onAddTask(hour)}
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      )}
    </div>
  );
};