// src/components/MainEvent/MainEvent.tsx
import { useMainEvent } from '@/hooks/useMainEvent';
import MatchCard from '@/components/ui/EventCarst/EventCart';
import { EventTimer } from '@/components/ui/EventTimer/EventTimer';
import { VoteButton } from '../ui/VoteButton/VoteButton';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../ui/Spinners/SpinnerX';

export const MainEvent = () => {
  const { event, loading, error } = useMainEvent();
  const navigate = useNavigate();

  const handleVoteClick = () => {
    if (!event?.id) return;
    navigate(`/vote/${event.id}`);
  };


  // https://static.vecteezy.com/system/resources/previews/006/504/705/large_2x/abstract-background-gradient-blue-purple-red-you-can-use-this-background-for-your-content-like-as-video-streaming-promotion-gaming-advertise-presentation-etc-free-photo.jpg

  return (
    <section
      className="h-full  py-6 md:pb-12 pt-[80px] hero overflow-x-hidden overflow-y-auto relative" id="hero"
      style={{
        backgroundImage: `url(${event?.imageBgDesktop || 'https://static.vecteezy.com/system/resources/thumbnails/013/446/246/small/digital-technology-circuits-blue-red-gradient-background-ai-big-data-iot-cyber-cloud-security-abstract-neon-wifi-tech-innovation-future-futuristic-internet-network-connection-illustration-vector.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Затемнение фона */}
      <div className="absolute inset-0" />
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
              <div className="flex justify-center items-center h-[345px] w-full max-w-[595px] mx-auto bg-shadow-inset-primary backdrop-blur-xs rounded-3xl">
                <Spinner size="sm" className="loaderM" />
              </div>
            ) : error || !event ? (
              <div className="alert alert-error shadow-lg text-white text-xl flex justify-center text-center">
                <span className="text-white text-xl p-4">
                  Событие не найдено. Голосование уже завершено.
                </span>
              </div>
            ) : (
              <MatchCard event={event} />
            )}
          </div>
          
          <div className="wrapper_in max-w-[520px] w-full mx-auto flex flex-col items-center gap-4">
            {/* Таймер */}
            {event && <EventTimer targetDate={event.votingEndsAt} />}
            {/* Кнопка Голосования */}
            <VoteButton
              onClick={handleVoteClick}
              disabled={loading || !event?.id}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Голосуем...
                </div>
              ) : (
                'Сделать прогноз'
              )}
            </VoteButton>
          </div>
        </div>
      </div>
    </section>
  );
};