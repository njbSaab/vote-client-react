// src/hooks/useEventById.ts
import { useState, useEffect, useCallback } from 'react';
import { eventsApi, myEventsApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { Event } from '@/types';

export const useEventById = (typeEventId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const fetchEvent = useCallback(async () => {
    // КРИТИЧНО: проверяем что typeEventId не undefined
    if (!typeEventId || typeEventId === 'undefined') {
      console.error('useEventById: некорректный typeEventId', typeEventId);
      setError('Некорректный ID события');
      setLoading(false);
      return;
    }

    console.log('useEventById: загрузка события', { typeEventId, isAuthenticated });

    try {
      setLoading(true);
      setError(null);
      
      // Если авторизован - используем authenticated endpoint (покажет userChoice)
      // Если нет - используем public endpoint
      const eventData = isAuthenticated
        ? await myEventsApi.getMyEvent(typeEventId)
        : await eventsApi.getPublicEvent(typeEventId);
      
      console.log('useEventById: событие загружено', eventData);
      setEvent(eventData);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Событие не найдено';
      console.error('useEventById: ошибка загрузки', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [typeEventId, isAuthenticated]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { 
    event, 
    loading, 
    error,
    refetch: fetchEvent // Функция для повторной загрузки
  };
};