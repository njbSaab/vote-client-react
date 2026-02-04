import type { Event } from '@/types';  // или '@/types/event.types'

interface MatchCardProps {
  event: Event | null;
}

export default function MatchCard({ event }: MatchCardProps) {
  if (!event) {
    // Заглушка при загрузке
    return (
      <div className="bg-black/70 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
        <div className="flex justify-center gap-12 mb-8">
          <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
          <div className="text-6xl font-bold text-gray-600 self-center">VS</div>
          <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-shadow-inset-primary backdrop-blur-xs rounded-3xl p-[20px] md:p-10 border border-purple-500/40 max-w-[595px] mx-auto card-event">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        {event.title}
      </h2>

      <div className="flex flex-row items-center justify-center gap-8 scene-wrapper">
        {/* Команда A */}
        <div className="text-center team-a">
          {event.logoA && (
            <img
              src={event.logoA}
              alt={event.participantA}
              className="w-32 h-auto md:w-[140px] md:h-[140px] object-contain mx-auto mb-4 rounded-full border-4 border-blue-600/50 shadow-lg logo-team"
            />
          )}
          <p className="text-xl md:text-2xl font-semibold text-shadow-primary">{event.participantA}</p>
        </div>

        <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent team-vs">VS</div>

        {/* Команда B */}
        <div className="text-center team-b">
          {event.logoB && (
            <img
              src={event.logoB}
              alt={event.participantB}
              className="w-32 h-auto md:w-[140px] md:h-[140px] object-contain mx-auto mb-4 rounded-full border-4 border-red-600/50 shadow-lg logo-team"
            />
          )}
          <p className="text-xl md:text-2xl font-semibold text-shadow-primary">{event.participantB}</p>
        </div>
      </div>

      {/* Статистика голосов */}
      {/* <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-400">Голосов</p>
          <p className="text-2xl font-bold">{event.totalVotes}</p>
        </div>
        <div>
          <p className="text-sm text-green-400">{event.participantA}</p>
          <p className="text-3xl font-bold">{event.percentageA}%</p>
        </div>
        <div>
          <p className="text-sm text-red-400">{event.participantB}</p>
          <p className="text-3xl font-bold">{event.percentageB}%</p>
        </div>
      </div> */}
    </div>
  );
}