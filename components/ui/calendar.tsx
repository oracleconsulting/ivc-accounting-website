'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface CalendarProps {
  value?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({ value, onSelect, className = '' }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  
  // Set initial date after mount to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(value || new Date());
  }, [value]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    if (currentDate) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const goToNextMonth = () => {
    if (currentDate) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  // Don't render until we have a date to avoid hydration mismatch
  if (!currentDate) {
    return <div className={`bg-white rounded-lg shadow-sm border ${className}`}>Loading...</div>;
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isSelected = value && date.toDateString() === value.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();

    days.push(
      <button
        key={day}
        onClick={() => onSelect?.(date)}
        className={`p-2 rounded-md transition-colors ${
          isSelected
            ? 'bg-blue-500 text-white'
            : isToday
            ? 'bg-gray-100 text-gray-900'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    </div>
  );
} 