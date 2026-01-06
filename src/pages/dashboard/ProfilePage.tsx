// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { myEventsApi, getErrorMessage } from '@/lib/api';
import type { Event } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка авторизации
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    loadEvents();
  }, [isAuthenticated, navigate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await myEventsApi.getMyEvents();
      setEvents(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Вы вышли из системы');
      navigate('/');
    } catch (error) {
      // Даже если запрос не прошёл, всё равно выходим локально
      toast.success('Вы вышли из системы');
      navigate('/');
    }
  };

  // Фильтрация событий
  const votedEvents = events.filter((e) => e.userAlreadyVoted);
  const availableEvents = events.filter((e) => !e.userAlreadyVoted && !e.hasVotingEnded);
  const endedEvents = events.filter((e) => e.hasVotingEnded);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a001f] to-black">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Главная</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <h1 className="text-xl font-bold">Профиль</h1>
          </div>

          <button onClick={handleLogout} className="btn btn-error btn-outline btn-sm">
            Выйти
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Карточка профиля */}
        <div className="card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-purple-500/30 mb-8">
          <div className="card-body">
            <h2 className="card-title text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Личный кабинет
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="stat bg-black/30 rounded-lg p-4">
                <div className="stat-title text-gray-400">Имя</div>
                <div className="stat-value text-2xl text-white">{user?.name}</div>
              </div>
              
              <div className="stat bg-black/30 rounded-lg p-4">
                <div className="stat-title text-gray-400">Email</div>
                <div className="stat-value text-xl text-white break-all">{user?.email}</div>
              </div>
              
              <div className="stat bg-black/30 rounded-lg p-4">
                <div className="stat-title text-gray-400">Баллы</div>
                <div className="stat-value text-2xl text-yellow-400">{user?.points || 0} 🏆</div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-white/5 rounded-2xl p-6 text-center">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title text-gray-400">Всего событий</div>
            <div className="stat-value text-primary">{events.length}</div>
          </div>

          <div className="stat bg-white/5 rounded-2xl p-6 text-center">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title text-gray-400">Проголосовано</div>
            <div className="stat-value text-green-400">{votedEvents.length}</div>
          </div>

          <div className="stat bg-white/5 rounded-2xl p-6 text-center">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title text-gray-400">Доступно</div>
            <div className="stat-value text-blue-400">{availableEvents.length}</div>
          </div>

          <div className="stat bg-white/5 rounded-2xl p-6 text-center">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="stat-title text-gray-400">Правильных</div>
            <div className="stat-value text-yellow-400">{user?.correctPredictions || 0}</div>
          </div>
        </div>

        {/* События где можно проголосовать */}
        {availableEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Доступно для голосования ({availableEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* События где уже проголосовал */}
        {votedEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Вы проголосовали ({votedEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Завершённые события */}
        {endedEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Завершённые ({endedEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Если нет событий */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗳️</div>
            <p className="text-xl text-gray-400 mb-6">Нет доступных событий</p>
            <button onClick={() => navigate('/')} className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 border-0">
              Перейти на главную
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Компонент карточки события
function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/vote/${event.typeEventId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card bg-gradient-to-b from-gray-900 to-black border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105 transform duration-300"
    >
      <div className="card-body p-4">
        {/* Заголовок */}
        <h3 className="card-title text-lg mb-2">{event.title}</h3>
        
        {/* Спорт и приз */}
        <div className="flex items-center justify-between text-sm opacity-80 mb-4">
          <span className="badge badge-outline">{event.sport}</span>
          {event.grandPrize && (
            <span className="text-yellow-500 font-semibold">🏆 {event.grandPrize} ₽</span>
          )}
        </div>

        {/* Участники */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-1">
            {event.logoA && (
              <img src={event.logoA} alt={event.participantA} className="w-8 h-8 object-contain" />
            )}
            <span className="text-sm truncate">{event.participantA}</span>
          </div>
          
          <span className="text-gray-500 font-bold">VS</span>
          
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm truncate">{event.participantB}</span>
            {event.logoB && (
              <img src={event.logoB} alt={event.participantB} className="w-8 h-8 object-contain" />
            )}
          </div>
        </div>

        {/* Если проголосовал - показываем результаты */}
        {event.userAlreadyVoted && (
          <div className="mt-4">
            {/* Progress bar */}
            <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-blue-500"
                style={{ width: `${event.percentageA}%` }}
                title={`${event.participantA}: ${event.percentageA}%`}
              />
              <div
                className="bg-red-500"
                style={{ width: `${event.percentageB}%` }}
                title={`${event.participantB}: ${event.percentageB}%`}
              />
              <div
                className="bg-yellow-500"
                style={{ width: `${event.percentageDraw}%` }}
                title={`Ничья: ${event.percentageDraw}%`}
              />
            </div>
            
            {/* Ваш выбор */}
            <p className="text-xs text-center text-green-400">
              ✓ Ваш выбор:{' '}
              <span className="font-bold">
                {event.userChoice === 1
                  ? event.participantA
                  : event.userChoice === 2
                  ? event.participantB
                  : 'Ничья'}
              </span>
            </p>
            
            {/* Статистика */}
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div className="text-center">
                <div className="text-blue-400 font-bold">{event.percentageA}%</div>
                <div className="text-gray-500">{event.votesA}</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold">{event.percentageB}%</div>
                <div className="text-gray-500">{event.votesB}</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">{event.percentageDraw}%</div>
                <div className="text-gray-500">{event.votesDraw}</div>
              </div>
            </div>
          </div>
        )}

        {/* Дата окончания голосования */}
        <div className="text-xs text-gray-500 mt-3 text-center">
          {event.hasVotingEnded ? (
            <span className="text-red-400">Голосование окончено</span>
          ) : (
            <span>
              До: {new Date(event.votingEndsAt).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>

        {/* Кнопка действия */}
        <div className="card-actions justify-end mt-4">
          {event.userAlreadyVoted ? (
            <span className="badge badge-success">Проголосовано</span>
          ) : event.hasVotingEnded ? (
            <span className="badge badge-ghost">Завершено</span>
          ) : (
            <span className="badge badge-primary">Голосовать →</span>
          )}
        </div>
      </div>
    </div>
  );
}