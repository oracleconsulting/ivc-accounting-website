'use client';

import { useEffect, useState } from 'react';

interface SafeDateProps {
  date: string | Date;
  format?: 'date' | 'datetime' | 'relative';
  fallback?: string;
}

export function SafeDate({ date, format = 'date', fallback = 'Loading...' }: SafeDateProps) {
  const [formatted, setFormatted] = useState<string>(fallback);
  
  useEffect(() => {
    const dateObj = new Date(date);
    
    switch (format) {
      case 'date':
        setFormatted(dateObj.toLocaleDateString());
        break;
      case 'datetime':
        setFormatted(dateObj.toLocaleString());
        break;
      case 'relative':
        // Use a simple relative time for now
        const now = new Date();
        const diff = now.getTime() - dateObj.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setFormatted(days === 0 ? 'Today' : `${days} days ago`);
        break;
    }
  }, [date, format]);

  return <span suppressHydrationWarning>{formatted}</span>;
} 