// src/pages/VotePage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEventById } from '@/hooks/useEventById';
import { useCountdown } from '@/hooks/useCountdown';
import { useAuthStore } from '@/stores/authStore';
import { useVoteStore } from '@/stores/voteStore';
import { myEventsApi, getErrorMessage } from '@/lib/api';
import MatchCard from '@/components/ui/EventCarst/EventCart';
import toast from 'react-hot-toast';

export default function VotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // КРИТИЧНО: проверяем что id существует
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-4">Некорректный ID события</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            На главную
          </button>
        </div>
      </div>
    );
  }

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setPendingVote, clearPendingVote, getPendingVote } = useVoteStore();

  const { event, loading, error, refetch } = useEventById(id);

  const countdown = useCountdown(
    event?.votingEndsAt ? new Date(event.votingEndsAt) : null
  );
  const timer = countdown;

  const [selectedChoice, setSelectedChoice] = useState<1 | 2 | 3>(1);
  const [isVoting, setIsVoting] = useState(false);

  // Автоматическая отправка голоса после авторизации
  useEffect(() => {
    const checkPendingVote = async () => {
      if (isAuthenticated && event && !event.userAlreadyVoted) {
        const pending = getPendingVote();
        
        console.log('VotePage: проверяем pending vote', { pending, eventId: id });
        
        if (pending && pending.eventId === id) {
          console.log('VotePage: найден pending vote, отправляем голос');
          // Автоматически отправляем голос
          await submitVote(pending.eventId, pending.choice);
          clearPendingVote();
        }
      }
    };

    checkPendingVote();
  }, [isAuthenticated, event, id]);

  const submitVote = async (eventId: string, choice: 1 | 2 | 3) => {
    console.log('VotePage: submitVote вызван', { eventId, choice });
    setIsVoting(true);
    
    try {
      await myEventsApi.vote(eventId, choice);
      
      // Перезагружаем событие с обновлёнными данными
      await refetch();

      // Редирект на страницу результатов
      navigate(`/profile/result/${eventId}`);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      console.error('VotePage: ошибка голосования', error);
      toast.error(errorMsg);
    } finally {
      setIsVoting(false);
    }
  };

  const handleVote = async () => {
    if (!event || timer.expired || event.userAlreadyVoted) {
      console.log('VotePage: голосование недоступно', { 
        hasEvent: !!event, 
        expired: timer.expired, 
        alreadyVoted: event?.userAlreadyVoted 
      });
      return;
    }

    console.log('VotePage: handleVote вызван', { isAuthenticated, eventId: id, choice: selectedChoice });

    // Если не авторизован - сохраняем выбор и редиректим
    if (!isAuthenticated) {
      console.log('VotePage: пользователь не авторизован, сохраняем pending vote');
      setPendingVote({
        eventId: id,
        choice: selectedChoice,
      });
      navigate('/auth', { state: { from: `/vote/${id}` } });
      return;
    }

    // Если авторизован - голосуем
    console.log('VotePage: пользователь авторизован, отправляем голос');
    await submitVote(id, selectedChoice);
  };

  const handleChoiceChange = (choice: 1 | 2 | 3) => {
    if (!event?.userAlreadyVoted) {
      setSelectedChoice(choice);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a001f] to-black">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-error text-2xl bg-gradient-to-b from-black via-[#0a001f] to-black">
        <div className="text-center">
          <p className="mb-4">{error || 'Событие не найдено'}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            На главную
          </button>
        </div>
      </div>
    );
  }

  const isButtonDisabled = timer.expired || event.userAlreadyVoted || isVoting;
  const buttonText = event.userAlreadyVoted
    ? 'Вы уже проголосовали'
    : timer.expired
    ? 'Голосование окончено'
    : isVoting
    ? 'Отправка...'
    : 'Голосовать';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a001f] to-black text-white">
      {/* Header */}
      <header className="py-4 px-4 md:px-8 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
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

          {isAuthenticated && (
            <button
              onClick={() => navigate('/profile')}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Профиль →
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 min-h-[80vh]">
        <div className="max-w-[600px] mx-auto">
          <MatchCard event={event} />

          {/* Показываем результаты если уже проголосовал */}
          {event.userAlreadyVoted && (
            <div className="my-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-400">
                  Вы проголосовали за{' '}
                  <span className="font-bold">
                    {event.userChoice === 1
                      ? event.participantA
                      : event.userChoice === 2
                      ? event.participantB
                      : 'ничью'}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Радиокнопки */}
          <div
            className={`radio-container my-5 ${
              selectedChoice === 1 ? 'blue' : selectedChoice === 2 ? 'red' : 'white'
            } ${event.userAlreadyVoted ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              id="participantA"
              name="choice"
              checked={selectedChoice === 1}
              onChange={() => handleChoiceChange(1)}
              disabled={event.userAlreadyVoted}
            />
            <label
              htmlFor="participantA"
              className={`participant-label ${
                selectedChoice === 1 ? 'bg-vote-blue' : ''
              }`}
            >
              <img
                src={event.logoA}
                alt={event.participantA}
                className="w-10 h-10 rounded-full object-contain"
              />
              <span className="pl-4">{event.participantA}</span>
              {event.userAlreadyVoted && (
                <span className="ml-auto text-sm opacity-80">
                  {event.percentageA}%
                </span>
              )}
            </label>

            <input
              type="radio"
              id="participantB"
              name="choice"
              checked={selectedChoice === 2}
              onChange={() => handleChoiceChange(2)}
              disabled={event.userAlreadyVoted}
            />
            <label
              htmlFor="participantB"
              className={`participant-label ${
                selectedChoice === 2 ? 'bg-vote-red' : ''
              }`}
            >
              <img
                src={event.logoB}
                alt={event.participantB}
                className="w-10 h-10 rounded-full object-contain"
              />
              <span className="pl-4">{event.participantB}</span>
              {event.userAlreadyVoted && (
                <span className="ml-auto text-sm opacity-80">
                  {event.percentageB}%
                </span>
              )}
            </label>

            <input
              type="radio"
              id="draw"
              name="choice"
              checked={selectedChoice === 3}
              onChange={() => handleChoiceChange(3)}
              disabled={event.userAlreadyVoted}
            />
            <label
              htmlFor="draw"
              className={`text-center vote-label font-medium ${
                selectedChoice === 3 ? 'bg-vote-white' : ''
              }`}
            >
              <span className="pl-4">Draw</span>
              {event.userAlreadyVoted && (
                <span className="ml-auto text-sm opacity-80">
                  {event.percentageDraw}%
                </span>
              )}
            </label>

            <div className="glider-container">
              <div className="glider" />
            </div>
          </div>

          {/* Кнопка */}
          <button
            onClick={handleVote}
            disabled={isButtonDisabled}
            className="w-full btn btn-gradient-hover vote-btn text-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVoting && (
              <span className="loading loading-spinner loading-sm mr-2"></span>
            )}
            {buttonText}
          </button>

          {/* Статистика голосов */}
          {event.userAlreadyVoted && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {event.percentageA}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {event.votesA} голосов
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl text-center">
                <div className="text-2xl font-bold text-red-400">
                  {event.percentageB}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {event.votesB} голосов
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {event.percentageDraw}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {event.votesDraw} голосов
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}