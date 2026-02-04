// src/stores/eventStore.ts
import { create } from 'zustand';
import type { Event } from '@/types';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

interface EventState {
  mainEvent: Event | null;
  loading: boolean;
  error: string | null;
  fetchMainEvent: () => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  mainEvent: null,
  loading: false,
  error: null,
  fetchMainEvent: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Event>(`${API_BASE_URL}/events/main`);
      set({ mainEvent: response.data, loading: false });
    } catch (err) {
      set({ error: 'Не удалось загрузить событие', loading: false });
    }
  },
}));