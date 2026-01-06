// src/hooks/useVoteWithAuth.ts
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export type VoteChoice = 1 | 2 | 3;

interface UseVoteWithAuthReturn {
  selectedChoice: VoteChoice;
  setChoice: (choice: VoteChoice) => void;
  voteIfAuthenticated: () => Promise<void>;
  isVoting: boolean;
}

export function useVoteWithAuth(
  typeEventId: string,
  reloadEvent: () => Promise<any>
): UseVoteWithAuthReturn {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice>(1);
  const [isVoting, setIsVoting] = useState(false);

  const setChoice = (choice: VoteChoice) => {
    setSelectedChoice(choice);
  };

  const voteIfAuthenticated = async () => {
    if (isAuthenticated) {
      setIsVoting(true);
      try {
        await api.post(`/events/${typeEventId}/vote`, {
          choice: selectedChoice,
        });
        
        await reloadEvent();
      } catch (error: any) {
        throw error;
      } finally {
        setIsVoting(false);
      }
    } else {
      // Бросаем ошибку для обработки в компоненте
      // Компонент должен показать модалку/редирект
      throw new Error('need-auth');
    }
  };

  return {
    selectedChoice,
    setChoice,
    voteIfAuthenticated,
    isVoting,
  };
}