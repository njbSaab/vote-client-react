// src/hooks/useMainEvent.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { Event } from '@/types'; 

export const useMainEvent = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Event>(API_ENDPOINTS.MAIN_EVENT);
        setEvent(response.data);
      } catch (err) {
        console.error('Ошибка загрузки главного события:', err);
        setError('Не удалось загрузить главное событие');
      } finally {
        setLoading(false);
      }
    };

    fetchMainEvent();
  }, []);

  return { event, loading, error };
};