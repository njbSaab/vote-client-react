// src/components/HeroBlock/HeroBlock.tsx
import { useMainEvent } from '@/hooks/useMainEvent';
import { useCountdown } from '@/hooks/useCountdown';
import MatchCard from '@/components/ui/EventCarst/EventCart';
export const MainEvent = () => {
  const { event, loading, error } = useMainEvent();

  // Таймер до окончания голосования
  const { days, hours, minutes, seconds, expired } = useCountdown(
    event?.votingEndsAt ? new Date(event.votingEndsAt) : null
  );

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
        <div className="flex flex-col items-center text-center gap-10 md:gap-16">
          {/* Заголовок и описание */}
          <div className="text-center md:max-w-[779px]">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
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
          <div className="bg-black/60 backdrop-blur-xl rounded-2xl px-8 py-6 border border-purple-500/30 shadow-2xl">
            <p className="text-gray-300 mb-4 text-lg md:text-xl">
              До начала события осталось:
            </p>

            {expired ? (
              <p className="text-2xl md:text-3xl font-bold text-red-400">
                Голосование завершено!
              </p>
            ) : (
              <div className="flex items-center justify-center gap-6 md:gap-10 text-4xl md:text-6xl font-bold">
                <div className="text-center">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {String(days).padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-base text-gray-400 mt-2">дней</p>
                </div>
                <span className="text-gray-500">:</span>
                <div className="text-center">
                  <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                    {String(hours).padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-base text-gray-400 mt-2">часов</p>
                </div>
                <span className="text-gray-500">:</span>
                <div className="text-center">
                  <span className="bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
                    {String(minutes).padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-base text-gray-400 mt-2">мин</p>
                </div>
                <span className="text-gray-500">:</span>
                <div className="text-center">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse">
                    {String(seconds).padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-base text-gray-400 mt-2">сек</p>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка действия */}
          <button className="btn btn-primary btn-lg px-12 py-6 text-xl shadow-lg shadow-purple-600/50 hover:shadow-purple-700/70 transition-all duration-300">
            Сделать прогноз
          </button>
        </div>
      </div>
    </section>
  );
};