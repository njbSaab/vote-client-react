// src/pages/VoteResultPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventById } from '@/hooks/useEventById';
import { useAuthStore } from '@/stores/authStore';

export default function VoteResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const { event, loading, error } = useEventById(id);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-4">Некорректный ID события</p>
          <button onClick={() => navigate('/profile')} className="btn btn-primary">
            К событиям
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a001f] to-black">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-4">{error || 'Событие не найдено'}</p>
          <button onClick={() => navigate('/profile')} className="btn btn-primary">
            К событиям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">К событиям</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-xl font-bold">Результаты</h1>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Профиль →
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Успешное голосование */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Голос учтён!
            </h2>
            <p className="text-white/70 text-lg">Спасибо за участие в голосовании</p>
          </div>

          {/* Карточка события */}
          <div className="card bg-gradient-to-b from-gray-900 to-black border border-purple-500/30 mb-8">
            <div className="card-body">
              <h3 className="text-3xl font-bold text-center mb-6">{event.title}</h3>
              
              {/* Спорт и приз */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="badge badge-outline badge-lg">{event.sport}</span>
                {event.grandPrize && (
                  <span className="text-yellow-500 font-semibold text-lg">
                    🏆 Призовой фонд: {event.grandPrize} ₽
                  </span>
                )}
              </div>

              {/* Участники */}
              <div className="flex items-center justify-between gap-8 mb-8">
                <div className="flex-1 text-center">
                  {event.logoA && (
                    <img src={event.logoA} alt={event.participantA} className="w-24 h-24 mx-auto mb-4 object-contain" />
                  )}
                  <h4 className="text-xl font-bold">{event.participantA}</h4>
                </div>
                
                <div className="text-4xl font-bold text-gray-500">VS</div>
                
                <div className="flex-1 text-center">
                  {event.logoB && (
                    <img src={event.logoB} alt={event.participantB} className="w-24 h-24 mx-auto mb-4 object-contain" />
                  )}
                  <h4 className="text-xl font-bold">{event.participantB}</h4>
                </div>
              </div>

              {/* Ваш выбор */}
              {event.userAlreadyVoted && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-400 text-xl">
                      Ваш выбор:{' '}
                      <span className="font-bold text-2xl">
                        {event.userChoice === 1
                          ? event.participantA
                          : event.userChoice === 2
                          ? event.participantB
                          : 'Ничья'}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Статистика голосования */}
          <div className="card bg-gradient-to-b from-gray-900 to-black border border-blue-500/30 mb-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Статистика голосования
              </h3>

              {/* Progress bar */}
              <div className="flex gap-2 h-8 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-blue-500 flex items-center justify-center text-sm font-bold"
                  style={{ width: `${event.percentageA}%` }}
                  title={`${event.participantA}: ${event.percentageA}%`}
                >
                  {event.percentageA > 10 && `${event.percentageA}%`}
                </div>
                <div
                  className="bg-red-500 flex items-center justify-center text-sm font-bold"
                  style={{ width: `${event.percentageB}%` }}
                  title={`${event.participantB}: ${event.percentageB}%`}
                >
                  {event.percentageB > 10 && `${event.percentageB}%`}
                </div>
                <div
                  className="bg-yellow-500 flex items-center justify-center text-sm font-bold"
                  style={{ width: `${event.percentageDraw}%` }}
                  title={`Ничья: ${event.percentageDraw}%`}
                >
                  {event.percentageDraw > 10 && `${event.percentageDraw}%`}
                </div>
              </div>

              {/* Детальная статистика */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-500/10 rounded-2xl">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {event.percentageA}%
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{event.participantA}</div>
                  <div className="text-2xl font-semibold text-white">{event.votesA} голосов</div>
                </div>

                <div className="text-center p-6 bg-red-500/10 rounded-2xl">
                  <div className="text-4xl font-bold text-red-400 mb-2">
                    {event.percentageB}%
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{event.participantB}</div>
                  <div className="text-2xl font-semibold text-white">{event.votesB} голосов</div>
                </div>

                <div className="text-center p-6 bg-yellow-500/10 rounded-2xl">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {event.percentageDraw}%
                  </div>
                  <div className="text-sm text-gray-400 mb-1">Ничья</div>
                  <div className="text-2xl font-semibold text-white">{event.votesDraw} голосов</div>
                </div>
              </div>

              {/* Всего голосов */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Всего голосов: <span className="text-white font-bold text-xl">{event.totalVotes}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white hover:from-blue-500 hover:to-purple-500"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Мой профиль
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="btn btn-lg btn-outline text-white hover:bg-white/10"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Другие события
            </button>
          </div>

          {/* Информация о начале события */}
          {!event.hasVotingEnded && (
            <div className="mt-8 text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 mb-2">Начало события:</p>
              <p className="text-xl font-bold text-white">
                {new Date(event.eventStartsAt).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}