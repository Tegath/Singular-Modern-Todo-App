import React, { useRef, useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { playSound } from '@/utils/playSound';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface TaskContentProps {
  content: string;
  onContentChange: (content: string) => void;
  onLineEdit: (index: number, newText: string) => void;
  onCheckboxChange: (index: number, checked: boolean) => void;
  isPreviewMode?: boolean;
}

export const TaskContent = ({ 
  content, 
  onLineEdit, 
  onCheckboxChange,
  onContentChange,
  isPreviewMode = false
}: TaskContentProps) => {
  const lines = content.split('\n');
  const checkboxPattern = /^(\s*)-\s*\[([ x])\]\s*(.*)$/;
  const contentEditableRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [completionTimes, setCompletionTimes] = useState<{[key: number]: number}>({});
  const startTime = Date.now();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentLine = lines[index];
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      const newTaskLine = `${indent}- [ ] `;
      const newLines = [...lines];
      newLines.splice(index + 1, 0, newTaskLine);
      onContentChange(newLines.join('\n'));
      setTimeout(() => {
        const nextRef = contentEditableRefs.current[index + 1];
        if (nextRef) {
          nextRef.focus();
          const range = document.createRange();
          range.selectNodeContents(nextRef);
          range.collapse(false);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }, 0);
      return;
    }

    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onContentChange('');
      return;
    }

    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      const prevRef = contentEditableRefs.current[index - 1];
      if (prevRef) {
        prevRef.focus();
        const range = document.createRange();
        range.selectNodeContents(prevRef);
        range.collapse(false);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }

    if (e.key === 'Backspace' && !e.currentTarget.textContent?.trim()) {
      e.preventDefault();
      if (lines.length === 1) {
        const indentMatch = lines[0].match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '';
        onContentChange(`${indent}- [ ] `);
        return;
      }
      const newLines = [...lines];
      newLines.splice(index, 1);
      onContentChange(newLines.join('\n'));
      setTimeout(() => {
        if (index - 1 >= 0) {
          const prevRef = contentEditableRefs.current[index - 1];
          if (prevRef) {
            prevRef.focus();
            const range = document.createRange();
            range.selectNodeContents(prevRef);
            range.collapse(false);
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      }, 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentLine = lines[index];
      const newLines = [...lines];
      
      if (e.shiftKey) {
        if (currentLine.startsWith('  ')) {
          newLines[index] = currentLine.slice(2);
          onContentChange(newLines.join('\n'));
        }
      } else {
        newLines[index] = '  ' + currentLine;
        onContentChange(newLines.join('\n'));
      }
    }
  };

  const findNextUnchecked = (lines: string[], currentIndex: number): number | null => {
    let firstUnchecked = -1;
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(checkboxPattern);
      if (match && match[2] === ' ') {
        if (firstUnchecked === -1) {
          firstUnchecked = i;
        }
      }
    }
    return firstUnchecked === -1 ? null : firstUnchecked;
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      playSound('notification.mp3');
      setCompletionTimes(prev => ({
        ...prev,
        [index]: Math.floor((Date.now() - startTime) / 60000)
      }));
    }
    onCheckboxChange(index, checked);
  };

  if (isPreviewMode) {
    return (
      <div 
        ref={containerRef}
        className="prose prose-sm max-w-none min-h-[200px]"
        onClick={(e) => {
          if (e.target === containerRef.current) {
            onContentChange(content + '\n');
          }
        }}
      >
        {lines.map((line, index) => {
          const match = line.match(checkboxPattern);
          if (match) {
            const [, indent, checkState, label] = match;
            const isChecked = checkState === 'x';
            const nextUncheckedIndex = findNextUnchecked(lines, index);
            const isNextUnchecked = index === nextUncheckedIndex;

            return (
              <div 
                key={index}
                className={cn(
                  "flex items-start gap-3 -mx-2 px-2 py-1.5 rounded-lg group/item",
                  "hover:bg-white/80 transition-all duration-200"
                )}
                style={{ marginLeft: indent.length * 12 }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleCheckboxChange(index, !!checked)}
                    className="mt-[3px] h-[18px] w-[18px] rounded-[4px] border-2 border-gray-300 
                      data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500
                      transition-all duration-200 hover:border-blue-400 cursor-pointer"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div className={cn(
                      "flex-1 inline-flex items-center",
                      nextUncheckedIndex !== null && index === nextUncheckedIndex && !isChecked && "bg-blue-500 rounded-md px-2 py-0.5"
                    )}>
                      <span
                        ref={el => contentEditableRefs.current[index] = el}
                        contentEditable
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onBlur={(e) => {
                          const newText = `${indent}- [${isChecked ? 'x' : ' '}] ${e.target.textContent || ''}`;
                          onLineEdit(index, newText);
                        }}
                        className={cn(
                          "text-[15px] leading-relaxed tracking-normal outline-none",
                          isChecked && "line-through text-gray-400",
                          nextUncheckedIndex !== null && index === nextUncheckedIndex && !isChecked && "text-white font-medium",
                        )}
                        suppressContentEditableWarning
                      >
                        {label}
                      </span>
                    </div>
                    {isChecked && completionTimes[index] && (
                      <span className="text-[11px] text-gray-400 italic ml-4">
                        {completionTimes[index]} minutes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="py-1">
              <span
                ref={el => contentEditableRefs.current[index] = el}
                contentEditable
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={(e) => {
                  onLineEdit(index, e.target.textContent || '');
                }}
                className="outline-none block"
                suppressContentEditableWarning
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-[240px] p-5 bg-gray-50/50 rounded-lg space-y-1.5 transition-all duration-300"
    >
      {lines.map((line, index) => {
        const match = line.match(checkboxPattern);
        if (match) {
          const [, indent, checkState, label] = match;
          const isChecked = checkState === 'x';
          const nextUncheckedIndex = findNextUnchecked(lines, index);
          const isNextUnchecked = index === nextUncheckedIndex;

          return (
            <div 
              key={index} 
              className="flex items-start gap-3 -mx-2 px-2 py-1.5 rounded-lg
                hover:bg-white/80 transition-all duration-200 group/item"
              style={{ marginLeft: indent.length * 12 }}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => handleCheckboxChange(index, !!checked)}
                className="mt-[3px] h-[18px] w-[18px] rounded-[4px] border-2 border-gray-300 
                  data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500
                  transition-all duration-200 hover:border-blue-400 cursor-pointer"
              />
              <div className="flex-1 flex items-center justify-between">
                <div className={cn(
                  "flex-1 inline-flex items-center",
                  nextUncheckedIndex !== null && index === nextUncheckedIndex && !isChecked && "bg-blue-500 rounded-md px-2 py-0.5"
                )}>
                  <span
                    ref={el => contentEditableRefs.current[index] = el}
                    contentEditable
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onBlur={(e) => {
                      const newText = `${indent}- [${isChecked ? 'x' : ' '}] ${e.target.textContent || ''}`;
                      onLineEdit(index, newText);
                    }}
                    className={cn(
                      "text-[15px] leading-relaxed tracking-normal outline-none",
                      isChecked && "line-through text-gray-400",
                      nextUncheckedIndex !== null && index === nextUncheckedIndex && !isChecked && "text-white font-medium",
                    )}
                    suppressContentEditableWarning
                  >
                    {label}
                  </span>
                </div>
                {isChecked && completionTimes[index] && (
                  <span className="text-[11px] text-gray-400 italic ml-4">
                    {completionTimes[index]} minutes
                  </span>
                )}
              </div>
            </div>
          );
        }
        return (
          <span
            key={index}
            ref={el => contentEditableRefs.current[index] = el}
            className="block px-2 py-1 text-[15px] leading-relaxed tracking-normal text-gray-700
              outline-none focus:bg-white rounded-lg hover:bg-white/80 transition-all duration-200
              whitespace-pre-wrap break-words"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newText = e.currentTarget.textContent || '';
              onLineEdit(index, newText);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
          >
            {line}
          </span>
        );
      })}
    </div>
  );
};