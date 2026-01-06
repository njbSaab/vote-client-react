// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User } from '@/types';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
        }),

      // ВОССТАНАВЛИВАЕМ СЕССИЮ ИЗ КУКИ
      loadUser: async () => {
        try {
          set({ isLoading: true });
          const response = await api.get('/profile/me');
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          if (err.response?.status !== 401) {
            console.error('Ошибка восстановления сессии:', err);
          }
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // УДАЛЯЕМ КУКУ 5 РАЗНЫМИ СПОСОБАМИ — один точно сработает
      logout: () => {
        const deleteCookie = (name: string) => {
          // 1. Основной способ — без domain
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`;
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;

          // 2. С domain (для localhost, 127.0.0.1 и реального домена)
          const domain = window.location.hostname;
          document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`;
          document.cookie = `${name}=; path=/; domain=.${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`;

          // 3. Для поддоменов (если будет)
          if (domain !== 'localhost') {
            document.cookie = `${name}=; path=/; domain=.votevibe.club; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`;
          }
        };

        deleteCookie('access_token');

        // Очищаем юзера
        set({
          user: null,
          isAuthenticated: false,
        });
        localStorage.clear();
      },

      // Вызывай это в main.tsx или App.tsx
      init: () => {
        get().loadUser();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Не сохраняем в localStorage isLoading
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Автоматическая инициализация при первом вызове
console.log('useAuthStore init');