// src/constants/api.ts

// Базовый URL сервера (можно вынести в .env позже)
// export const API_BASE_URL = 'https://devevent.pro';
export const API_BASE_URL = 'http://localhost:3777';
// Эндпоинты
export const API_ENDPOINTS = {
  // События
  MAIN_EVENT: `${API_BASE_URL}/events/main`,
  CAROUSEL_EVENTS: `${API_BASE_URL}/events/carousel`,
  PUBLIC_EVENTS: `${API_BASE_URL}/events`,
  MY_EVENTS: `${API_BASE_URL}/events/me`,
  DASHBOARD: `${API_BASE_URL}/events/dashboard`,
  VOTE: (typeEventId: string) => `${API_BASE_URL}/events/${typeEventId}/vote`,

  // Авторизация
  AUTH_SEND_CODE: `${API_BASE_URL}/auth/send-code`,
  AUTH_VERIFY_CODE: `${API_BASE_URL}/auth/verify-code`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,

  // Профиль
  PROFILE_ME: `${API_BASE_URL}/profile/me`,
} as const;