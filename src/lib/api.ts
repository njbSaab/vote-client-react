// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import type { Event } from '@/types';
import type { User } from '@/types';
import type { SendCodeRequest, VerifyCodeRequest } from '@/types';
import { API_BASE_URL  } from '@/constants/api';

const API_URL = API_BASE_URL ;

// Создаём axios instance с credentials
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ← Обязательно для cookie!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Можно очистить authStore здесь
      // useAuthStore.getState().logout();
      
      // Редирект на главную при 401 (опционально)
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


// ========================================
// AUTH API
// ========================================


interface AuthResponse {
  user: User;
}

export const authApi = {
  sendCode: async (data: SendCodeRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/send-code', data);
    return response.data;
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-code', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// ========================================
// PROFILE API
// ========================================

export const profileApi = {
  // Получить данные текущего пользователя (восстановление сессии)
  getMe: async (): Promise<User> => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  // Обновить профиль
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/profile/me', data);
    return response.data;
  },
};

// ========================================
// EVENTS API (PUBLIC)
// ========================================

export const eventsApi = {
  // Главное событие (публичное)
  getMainEvent: async (): Promise<Event | null> => {
    const response = await api.get('/events/main');
    return response.data;
  },

  // Карусель событий (публичные)
  getCarouselEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/carousel');
    return response.data;
  },

  // Публичный список событий
  getPublicEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  // Одно публичное событие по typeEventId
  getPublicEvent: async (typeEventId: string): Promise<Event> => {
    const response = await api.get(`/events/${typeEventId}`);
    return response.data;
  },
};

// ========================================
// EVENTS API (AUTHENTICATED)
// ========================================

export const myEventsApi = {
  // Все мои события (публичные + приватные)
  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/me');
    return response.data;
  },

  // Одно моё событие по typeEventId
  getMyEvent: async (typeEventId: string): Promise<Event> => {
    const response = await api.get(`/events/me/${typeEventId}`);
    return response.data;
  },

  // Dashboard с категориями и статистикой
  getDashboard: async (): Promise<any> => {
    const response = await api.get('/events/dashboard');
    return response.data;
  },

  // Голосование
  vote: async (
    typeEventId: string,
    choice: 1 | 2 | 3
  ): Promise<{ success: boolean }> => {
    const response = await api.post(`/events/${typeEventId}/vote`, { choice });
    return response.data;
  },
};

// ========================================
// ERROR HANDLING
// ========================================

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Произошла неизвестная ошибка';
};

// ========================================
// EXPORT DEFAULT FOR COMPATIBILITY
// ========================================

export default api;