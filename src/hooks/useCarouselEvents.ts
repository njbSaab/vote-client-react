// src/hooks/useCarouselEvents.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Event } from '@/types';
import { API_ENDPOINTS } from '@/constants/api';

export const useCarouselEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Event[]>(API_ENDPOINTS.CAROUSEL_EVENTS);
        setEvents(response.data);
      } catch (err) {
        console.error('Ошибка загрузки карусели:', err);
        setError('Не удалось загрузить события');
      } finally {
        setLoading(false);
      }
    };

    fetchCarousel();
  }, []);

  return { events, loading, error };
};