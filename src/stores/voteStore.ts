// src/stores/voteStore.ts
import { create } from 'zustand';

export interface PendingVote {
  eventId: string;
  choice: 1 | 2 | 3;
}

export interface VoteState {
  pendingVote: PendingVote | null;
  setPendingVote: (vote: PendingVote) => void;
  clearPendingVote: () => void;
  getPendingVote: () => PendingVote | null;
}

export const useVoteStore = create<VoteState>((set, get) => ({
  pendingVote: null,

  setPendingVote: (vote) => {
    set({ pendingVote: vote });
    // Сохраняем в localStorage для сохранения после перезагрузки
    localStorage.setItem('pending_vote', JSON.stringify(vote));
  },

  clearPendingVote: () => {
    set({ pendingVote: null });
    localStorage.removeItem('pending_vote');
  },

  getPendingVote: () => {
    // Приоритет — из состояния
    const current = get().pendingVote;
    if (current) return current;

    // Если нет в state - проверяем localStorage
    const saved = localStorage.getItem('pending_vote');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PendingVote;
        // Восстанавливаем в state
        set({ pendingVote: parsed });
        return parsed;
      } catch {
        localStorage.removeItem('pending_vote');
        return null;
      }
    }
    
    return null;
  },
}));