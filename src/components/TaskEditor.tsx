import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { TaskContent } from './task-editor/TaskContent';
import { Edit, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TaskTitle } from './task-editor/TaskTitle';
import { Submission } from '../types';
import { cn } from '@/lib/utils';

interface TaskEditorProps {
  task: Task | undefined;
  onSave: (task: Task) => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  onSubmit?: (submission: Submission) => void;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ 
  task, 
  onSave,
  isEditing,
  onEditingChange,
  onSubmit
}) => {
  const [localTitle, setLocalTitle] = useState(task?.title || '');
  
  useEffect(() => {
    if (task) {
      setLocalTitle(task.title);
    }
  }, [task?.title]);

  if (!task) return null;

  const handleTitleChange = (newTitle: string) => {
    if (newTitle.trim()) {
      setLocalTitle(newTitle);
      onSave({ ...task, title: newTitle.trim() });
    }
  };

  const handleContentChange = (content: string) => {
    onSave({ ...task, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd } = textarea;
      const beforeCursor = task.content.substring(0, selectionStart);
      const afterCursor = task.content.substring(selectionEnd);
      
      // Get the current line's indentation
      const currentLine = beforeCursor.split('\n').pop() || '';
      const indent = currentLine.match(/^(\s*)/)?.[1] || '';
      
      // Create new todo with space after checkbox
      const newContent = beforeCursor + `\n${indent}- [ ] ` + afterCursor;
      handleContentChange(newContent);
      
      // Set cursor position after the checkbox and space
      setTimeout(() => {
        const newPosition = selectionStart + indent.length + 7; // +1 for extra space
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd } = textarea;
      const beforeCursor = task.content.substring(0, selectionStart);
      const afterCursor = task.content.substring(selectionEnd);
      
      // Get the current line's indentation
      const currentLine = beforeCursor.split('\n').pop() || '';
      const currentIndent = currentLine.match(/^(\s*)/)?.[1] || '';
      
      // Create new indented todo with space after checkbox
      const newContent = beforeCursor + `\n${currentIndent}  - [ ] ` + afterCursor;
      handleContentChange(newContent);
      
      // Set cursor position after the checkbox and space
      setTimeout(() => {
        const newPosition = selectionStart + currentIndent.length + 9; // +1 for extra space
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && task) {
      const submission: Submission = {
        id: generateId(),
        title: task.title,
        content: [],
        timestamp: new Date().toISOString(),
        duration: 0,
        completed: true,
        questions: []
      };
      onSubmit(submission);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100/50 p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out">
      <div className="space-y-6">
        <TaskTitle
          title={localTitle}
          onTitleChange={handleTitleChange}
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Tasks</div>
            <div className="min-h-[240px] bg-gray-50/50 rounded-lg transition-all duration-300">
              <TaskContent
                content={task.content}
                onContentChange={handleContentChange}
                onLineEdit={(index, newText) => {
                  const lines = task.content.split('\n');
                  lines[index] = newText;
                  handleContentChange(lines.join('\n'));
                }}
                onCheckboxChange={(index, checked) => {
                  const lines = task.content.split('\n');
                  lines[index] = lines[index].replace(
                    /\[([ x])\]/,
                    `[${checked ? 'x' : ' '}]`
                  );
                  handleContentChange(lines.join('\n'));
                }}
                isPreviewMode={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Notes</div>
            <Textarea
              value={task.notes || ''}
              onChange={(e) => onSave({ ...task, notes: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Add your notes here..."
              className="min-h-[240px] text-[15px] leading-relaxed tracking-normal font-normal 
                border-none focus:ring-1 focus:ring-blue-200 bg-gray-50/50 p-4 rounded-lg
                placeholder:text-gray-400"
              style={{ 
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditingChange(!isEditing)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <span className="mr-2 text-sm">
              {isEditing ? 'Preview' : 'Edit'}
            </span>
            {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>

          <div className="text-xs text-gray-400">
            ⌘/Ctrl+Enter: new todo • Tab: indent • Shift+Tab: un-indent
          </div>
        </div>
      </div>
    </div>
  );
};