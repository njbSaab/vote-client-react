// src/components/shared/AuthHeader.tsx
import { useNavigate } from 'react-router-dom';

interface AuthHeaderProps {
  showBackButton?: boolean;     // можно скрывать кнопку "Назад" на некоторых страницах
  backPath?: string;            // если нужно редиректить не на '/', а куда-то ещё
}

export default function SmallHeader({
  showBackButton = true,
  backPath = '/',
}: AuthHeaderProps = {}) {
  const navigate = useNavigate();

  return (
    <header className="py-2 px-2 max-w-md mx-auto fixed top-0 left-0 right-0 z-[100] h-[72px]">
      <div className="mx-auto flex items-center justify-between h-full">
        {/* Кнопка Назад */}
        {showBackButton && (
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-semibold">Назад</span>
          </button>
        )}

        {/* Логотип по центру */}
        <div className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(backPath)}>
            <img
              src="https://i.ibb.co/Qvd3RYXX/5.png"
              alt="Logo"
              className="h-auto w-[50px]"
            />
        </div>
      </div>
    </header>
  );
}