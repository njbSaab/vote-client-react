// src/pages/AuthPage.tsx (или LoginPage.tsx)
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi, myEventsApi, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useVoteStore } from '@/stores/voteStore';
import { useCodeAttempts } from '@/hooks/useCodeAttempts';
import toast from 'react-hot-toast';
import SmallHeader from '../../components/shared/SmallHeader/SmallHeader';


export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { getPendingVote, clearPendingVote } = useVoteStore();

  const hasShownPendingToast = useRef(false);
  // Защита от брута
  const {
    failedAttempts,
    attemptsLeft,
    isBlocked,
    blockTimeLeft,
    incrementFailed,
    resetAttempts,
  } = useCodeAttempts();

  // Шаги формы
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Проверяем pendingVote при монтировании
useEffect(() => {
  const pending = getPendingVote();
  if (pending && !hasShownPendingToast.current) {
    toast('Подтведите свой выбор', {
      icon: '🚀',
      className: 'pending-vote-toast bg-shadow-inset-primary',   
      style: {                            
        padding: '16px 24px',
        color: '#e0e7ff',
        fontWeight: '500',
        maxWidth: '400px',
      },
    });

    hasShownPendingToast.current = true;
  }
}, []);
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setMessage('Заполните все поля');
      return;
    }

    resetAttempts();
    setIsLoading(true);
    setMessage('');

    console.log('AuthPage: отправка кода', { email, name });

    try {
      await authApi.sendCode({
        email,
        name,
        siteUrl: window.location.origin,
      });

      console.log('AuthPage: код отправлен');
      setShowCodeForm(true);
      toast.success('Код отправлен на вашу почту!');
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      console.error('AuthPage: ошибка отправки кода', err);
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setMessage('Введите 6-значный код');
      return;
    }

    if (isBlocked) {
      setMessage(`Слишком много попыток! Подождите ${blockTimeLeft} сек`);
      return;
    }

    setIsLoading(true);
    setMessage('');

    console.log('AuthPage: проверка кода', { email, code });

    try {
      const response = await authApi.verifyCode({
        email,
        code,
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      });

      console.log('AuthPage: код подтверждён, пользователь создан', response.user);

      resetAttempts();
      
      // Сохраняем пользователя в store (автоматически сохранится в localStorage)
      login(response.user);
      
      toast.success(`Добро пожаловать, ${response.user.name}!`);

      // Проверяем есть ли pending vote
      const pending = getPendingVote();
      console.log('AuthPage: проверяем pending vote', pending);
      
      if (pending) {
        // Отправляем голос прямо здесь, не редиректим
        console.log('AuthPage: отправляем pending vote', pending);
        try {
          const voteResult = await myEventsApi.vote(pending.eventId, pending.choice);
          console.log('AuthPage: голос отправлен успешно', voteResult);
          clearPendingVote();
          toast.success('Ваш голос учтён!');
          // Редирект на страницу результатов
          navigate(`/profile/result/${pending.eventId}`);
        } catch (voteErr) {
          console.error('AuthPage: ошибка отправки голоса', voteErr);
          const voteErrMsg = getErrorMessage(voteErr);
          toast.error(voteErrMsg || 'Не удалось отправить голос');
          // Всё равно редиректим на страницу голосования
          navigate(`/vote/${pending.eventId}`);
        }
        return; // Важно: выходим из функции
      } else if (location.state?.from) {
        // Редирект откуда пришли
        console.log('AuthPage: редиректим откуда пришли', location.state.from);
        navigate(location.state.from);
      } else {
        // По умолчанию на главную
        console.log('AuthPage: редиректим на главную');
        navigate('/');
      }
    } catch (err: any) {
      incrementFailed();

      const left = attemptsLeft;

      if (left <= 0) {
        setMessage('Аккаунт заблокирован на 10 минут');
        toast.error('Слишком много неверных попыток!');
      } else {
        const errorMsg = `Неверный код! Осталось попыток: ${left}`;
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleBackToEmail = () => {
    setShowCodeForm(false);
    setCode('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
      {/* Header */}
      <SmallHeader />

      <main className="container mx-auto px-4 pt-12 md:pt-24 min-h-[85vh]">
        <div className="max-w-md mx-auto">
          {/* Заголовок */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent animate-fadeIn">
            Вход по коду
          </h1>

          {/* Шаг 1: Email + Имя */}
          {!showCodeForm ? (
            <form onSubmit={handleSendCode} className="space-y-8">
              <div>
                <label className="block text-lg mb-3 opacity-90">Ваше имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/50 outline-none transition text-white placeholder-white/50"
                  placeholder="Алексей"
                />
              </div>

              <div>
                <label className="block text-lg mb-3 opacity-90">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/50 outline-none transition text-white placeholder-white/50"
                  placeholder="you@example.com"
                />
              </div>

              {message && (
                <p className="text-sm text-red-400 text-center">{message}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || isBlocked}
                className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBlocked ? (
                  <span>Заблокировано ({blockTimeLeft} сек)</span>
                ) : isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Отправляем код...
                  </span>
                ) : (
                  'Получить код на почту'
                )}
              </button>
            </form>
          ) : (
            // Шаг 2: Ввод кода
            <div className="space-y-8 text-center">
              <p className="text-white/70 text-lg">
                Код отправлен на{' '}
                <span className="text-white font-bold">{email}</span>
              </p>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={handleCodeInput}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-6 py-5 text-center text-4xl tracking-widest font-mono rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/50 outline-none transition text-white placeholder-white/30"
                />
              </div>

              {message && (
                <p className="text-sm text-red-400">{message}</p>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6 || isBlocked}
                className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBlocked ? (
                  <span>Заблокировано ({blockTimeLeft} сек)</span>
                ) : isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Проверяем...
                  </span>
                ) : (
                  'Войти'
                )}
              </button>

              <button
                onClick={handleBackToEmail}
                className="text-blue-400 hover:underline text-sm transition-colors"
              >
                ← Изменить email
              </button>

              {/* Показываем количество оставшихся попыток */}
              {failedAttempts > 0 && !isBlocked && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Осталось попыток: {attemptsLeft}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="mt-12 text-center text-sm text-gray-400">
            <p>Код действителен в течение 10 минут</p>
            <p className="mt-2">
              После {failedAttempts > 0 ? attemptsLeft : 5} неверных попыток аккаунт
              будет заблокирован на 10 минут
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2025 VoteVibe. Все права защищены.</p>
      </footer>
    </div>
  );
}