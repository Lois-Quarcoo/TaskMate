import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialMinutes = 25, onComplete = null) => {
  const [initialSeconds, setInitialSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            if (onComplete) {
              onComplete(mode, initialSeconds);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, initialSeconds]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  
  const reset = (mins = initialMinutes) => {
    setIsActive(false);
    const secs = mins * 60;
    setInitialSeconds(secs);
    setSecondsLeft(secs);
  };

  const setTimerDuration = (mins) => {
    const secs = mins * 60;
    setInitialSeconds(secs);
    setSecondsLeft(secs);
  };

  const toggleMode = (newMode = null) => {
    setIsActive(false);
    const nextMode = newMode || (mode === 'focus' ? 'break' : 'focus');
    setMode(nextMode);
    const defaultMins = nextMode === 'focus' ? 25 : 5;
    setInitialSeconds(defaultMins * 60);
    setSecondsLeft(defaultMins * 60);
  };

  return {
    secondsLeft,
    isActive,
    mode,
    start,
    pause,
    reset,
    setTimerDuration,
    toggleMode,
    progress: initialSeconds > 0 ? (initialSeconds - secondsLeft) / initialSeconds : 0,
  };
};
