// src/components/MainEvent/MainEvent.tsx
import { useMainEvent } from '@/hooks/useMainEvent';
import MatchCard from '@/components/ui/EventCarst/EventCart';
import { EventTimer } from '@/components/ui/EventTimer/EventTimer';
import { VoteButton } from '../ui/VoteButton/VoteButton';
import { useNavigate } from 'react-router-dom';

export const MainEvent = () => {
  const { event, loading, error } = useMainEvent();
  const navigate = useNavigate();

  const handleVoteClick = () => {
    if (!event?.id) return;
    navigate(`/vote/${event.id}`);
  };

  return (
    <section
      className="h-full py-6 md:pb-12 pt-[80px] hero overflow-x-hidden overflow-y-auto relative" id="hero"
      style={{
        backgroundImage: `url(${event?.imageBgDesktop || 'https://images.unsplash.com/photo-1557683316-973673baf926'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      <div className="container relative mx-auto">
        <div className="flex flex-col items-center text-center gap-[20px]">
          {/* Заголовок и описание */}
          <div className="text-center">
            <h1 className="text-2xl md:text-5xl font-extrabold mb-[20px] bg-gradient-to-r bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Делай прогнозы — выигрывай призы
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 opacity-90">
              Выбери исход матча и получи бонус за точный прогноз
            </p>
          </div>

          {/* Карточка события */}
          <div className="w-full max-w-4xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
            {loading ? (
              <div className="skeleton h-96 w-full rounded-3xl" />
            ) : error || !event ? (
              <div className="alert alert-error shadow-lg">
                <span>Не удалось загрузить главное событие</span>
              </div>
            ) : (
              <MatchCard event={event} />
            )}
          </div>

          {/* Таймер */}
          {event && <EventTimer targetDate={event.votingEndsAt} />}

          {/* Кнопка Голосования */}
         <VoteButton
            onClick={handleVoteClick}
            disabled={loading || !event?.id}
          >
            {loading ? '<span class="loading loading-spinner"></span> Голосуем...' : 'Сделать прогноз'}
        </VoteButton>
        </div>
      </div>
    </section>
  );
};