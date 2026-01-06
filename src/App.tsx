// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import Home from './pages/public/Home';
import VotePage from './pages/share/VotePage';
import AuthPage from './pages/public/AuthPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import VoteResultPage from './pages/dashboard/VoteResultPage';

// Protected Route компонент
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const init = useAuthStore((state) => state.init);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Инициализация authStore при монтировании приложения
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Главная страница - редирект на /profile если авторизован */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <Home />
              )
            } 
          />

          {/* Публичные маршруты */}
          <Route path="/vote/:id" element={<VotePage />} />
          
          {/* Auth - редирект на /profile если уже авторизован */}
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <AuthPage />
              )
            } 
          />

          {/* Защищённые маршруты профиля (домашняя для авторизованных) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* Страница результатов голосования */}
          <Route
            path="/profile/result/:id"
            element={
              <ProtectedRoute>
                <VoteResultPage />
              </ProtectedRoute>
            }
          />

          {/* Редирект всего остального */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            duration: 2500,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;