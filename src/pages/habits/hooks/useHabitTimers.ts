
import { useState, useEffect } from 'react';

export const useHabitTimers = () => {
  const [runningTimers, setRunningTimers] = useState<{ [key: string]: number }>({});
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    Object.keys(runningTimers).forEach(habitId => {
      timers[habitId] = setInterval(() => {
        setElapsedTimes(prev => ({
          ...prev,
          [habitId]: (prev[habitId] || 0) + 1
        }));
      }, 60000); // Update every minute
    });

    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, [runningTimers]);

  return {
    runningTimers,
    setRunningTimers,
    elapsedTimes,
    setElapsedTimes
  };
};
