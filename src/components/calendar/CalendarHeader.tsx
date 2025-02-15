import React from 'react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentTime: Date;
}

export const CalendarHeader = ({ currentTime }: CalendarHeaderProps) => {
  return (
    <h2 className="text-xl font-semibold mb-4 text-primary-dark">
      {format(currentTime, 'EEEE, MMMM d')}
    </h2>
  );
};