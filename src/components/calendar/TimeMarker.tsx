import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TimeMarkerProps {
  currentHour: number;
  currentMinute: number;
  focusMode: boolean;
}

export const TimeMarker = ({ currentHour, currentMinute, focusMode }: TimeMarkerProps) => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const calculatePosition = () => {
      const hourHeight = focusMode ? 180 : 40; // Adjust based on your hour row height
      const minuteProgress = currentMinute / 60;
      const totalPosition = (currentHour + minuteProgress) * hourHeight;
      
      // In focus mode, adjust position to center current hour
      if (focusMode) {
        const centerOffset = hourHeight;
        return totalPosition - centerOffset;
      }
      
      return totalPosition;
    };

    setPosition(calculatePosition());
    
    const interval = setInterval(() => {
      setPosition(calculatePosition());
    }, 60000);

    return () => clearInterval(interval);
  }, [focusMode, currentHour, currentMinute]);
  
  return (
    <div 
      className={cn(
        "absolute left-0 right-0 pointer-events-none z-50 transition-transform duration-300",
        focusMode && "px-6"
      )}
      style={{ 
        transform: `translateY(${position}px)`,
      }}
    >
      <div className="relative">
        <div className={cn(
          "absolute left-0 right-0 h-0.5 bg-[#007AFF] shadow-sm",
          focusMode && "rounded-full"
        )}>
          <div className="absolute left-0 w-2 h-2 rounded-full bg-[#007AFF] -translate-y-[3px]" />
          <div className="absolute right-0 w-2 h-2 rounded-full bg-[#007AFF] -translate-y-[3px]" />
        </div>
      </div>
    </div>
  );
};