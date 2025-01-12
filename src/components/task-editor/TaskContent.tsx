import React, { useRef } from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface TaskContentProps {
  content: string;
  onContentChange: (content: string) => void;
  onLineEdit: (index: number, newText: string) => void;
  onCheckboxChange: (index: number, checked: boolean) => void;
}

export const TaskContent = ({ 
  content, 
  onLineEdit, 
  onCheckboxChange,
  onContentChange 
}: TaskContentProps) => {
  const lines = content.split('\n');
  const checkboxPattern = /^(\s*)-\s*\[([ x])\]\s*(.+)$/;
  const contentEditableRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, index: number, indent: string, isCheckbox: boolean) => {
    const newLines = [...lines];
    const currentLine = newLines[index];

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      // Create new checkbox with current indentation
      e.preventDefault();
      const newLine = `${indent}- [ ] `;
      newLines.splice(index + 1, 0, newLine);
      onContentChange(newLines.join('\n'));
      
      setTimeout(() => {
        const nextRef = contentEditableRefs.current[index + 1];
        if (nextRef) {
          nextRef.focus();
          const range = document.createRange();
          range.selectNodeContents(nextRef);
          range.collapse(false);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(e.currentTarget);
      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      // If it's a checkbox line, create new checkbox, otherwise create normal line
      const newLine = isCheckbox ? `${indent}- [ ] ` : '';
      newLines.splice(index + 1, 0, newLine);
      onContentChange(newLines.join('\n'));
      
      setTimeout(() => {
        const nextRef = contentEditableRefs.current[index + 1];
        if (nextRef) {
          nextRef.focus();
          const range = document.createRange();
          range.selectNodeContents(nextRef);
          range.collapse(false);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Un-indent
        if (currentLine.startsWith('  ')) {
          newLines[index] = currentLine.slice(2);
          onContentChange(newLines.join('\n'));
        }
      } else if (isCheckbox) {
        // Regular indent for checkboxes
        newLines[index] = `  ${currentLine}`;
        onContentChange(newLines.join('\n'));
      } else {
        // Create new checkbox when pressing Tab on regular text
        newLines[index] = `${indent}- [ ] ${currentLine}`;
        onContentChange(newLines.join('\n'));
        
        setTimeout(() => {
          const ref = contentEditableRefs.current[index];
          if (ref) {
            ref.focus();
            const range = document.createRange();
            range.selectNodeContents(ref);
            range.collapse(false);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 0);
      }
    } else if (e.key === 'Backspace') {
      if (!e.currentTarget.textContent?.trim()) {
        e.preventDefault();
        newLines.splice(index, 1);
        onContentChange(newLines.join('\n'));
        
        setTimeout(() => {
          const prevRef = contentEditableRefs.current[index - 1];
          if (prevRef) {
            prevRef.focus();
            const range = document.createRange();
            range.selectNodeContents(prevRef);
            range.collapse(false);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 0);
      }
    }
  };

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
          return (
            <div 
              key={index} 
              className="flex items-start gap-3 -mx-2 px-2 py-1.5 rounded-lg hover:bg-white/80 
                transition-all duration-200 group/item"
              style={{ marginLeft: indent.length * 12 }}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => onCheckboxChange(index, !!checked)}
                className="mt-[3px] h-[18px] w-[18px] rounded-[4px] border-2 border-gray-300 
                  data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500
                  transition-all duration-200 hover:border-blue-400"
              />
              <span 
                ref={el => contentEditableRefs.current[index] = el}
                className={`
                  flex-1 transition-all duration-200 text-[15px] leading-relaxed tracking-normal
                  ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}
                  group-hover/item:text-gray-900
                  outline-none focus:bg-white focus:px-2 -ml-2
                  whitespace-pre-wrap break-words
                `}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || '';
                  onLineEdit(index, `${indent}- [${checkState}] ${newText}`);
                }}
                onKeyDown={(e) => handleKeyDown(e, index, indent, true)}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  document.execCommand('insertText', false, text);
                }}
              >
                {label}
              </span>
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
            onKeyDown={(e) => handleKeyDown(e, index, '', false)}
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