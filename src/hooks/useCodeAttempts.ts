// src/hooks/useCodeAttempts.ts
import { useState, useEffect, useRef } from 'react';

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 600; // 10 минут в секундах

export function useCodeAttempts() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Восстанавливаем состояние из localStorage
  useEffect(() => {
    const savedBlockEnd = localStorage.getItem('code_block_end');
    if (savedBlockEnd) {
      const blockEnd = parseInt(savedBlockEnd);
      const now = Date.now();
      
      if (blockEnd > now) {
        setIsBlocked(true);
        setBlockTimeLeft(Math.ceil((blockEnd - now) / 1000));
      } else {
        localStorage.removeItem('code_block_end');
        localStorage.removeItem('failed_attempts');
      }
    }

    const savedAttempts = localStorage.getItem('failed_attempts');
    if (savedAttempts) {
      setFailedAttempts(parseInt(savedAttempts));
    }
  }, []);

  // Таймер блокировки
  useEffect(() => {
    if (isBlocked && blockTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            localStorage.removeItem('code_block_end');
            localStorage.removeItem('failed_attempts');
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isBlocked, blockTimeLeft]);

  const incrementFailed = () => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem('failed_attempts', newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const blockEnd = Date.now() + (BLOCK_DURATION * 1000);
      localStorage.setItem('code_block_end', blockEnd.toString());
      setIsBlocked(true);
      setBlockTimeLeft(BLOCK_DURATION);
    }
  };

  const resetAttempts = () => {
    setFailedAttempts(0);
    setIsBlocked(false);
    setBlockTimeLeft(0);
    localStorage.removeItem('failed_attempts');
    localStorage.removeItem('code_block_end');
  };

  const attemptsLeft = MAX_ATTEMPTS - failedAttempts;

  return {
    failedAttempts,
    attemptsLeft,
    isBlocked,
    blockTimeLeft,
    incrementFailed,
    resetAttempts,
  };
}