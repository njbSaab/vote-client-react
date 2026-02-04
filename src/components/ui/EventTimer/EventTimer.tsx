// src/components/EventTimer.tsx
import { useCountdown } from '@/hooks/useCountdown';

interface EventTimerProps {
  targetDate: string | null; // votingEndsAt
}

export const EventTimer = ({ targetDate }: EventTimerProps) => {
  const { days, hours, minutes, seconds, expired } = useCountdown(
    targetDate ? new Date(targetDate) : null
  );

  return (
      <div>
      <p className="text-gray-300 text-lg md:text-xl text-center">
        До начала события осталось:
      </p>
    <div className="md:p-[10px] py-[10px] px-0">

      {expired ? (
        <p className="text-2xl md:text-3xl font-bold text-red-400 text-center">
          Голосование завершено!
        </p>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-[5px] md:gap-[10px] text-2xl md:text-4xl font-bold">
          <div className="text-center bg-shadow-inset-primary backdrop-blur-xs rounded-3xl border border-purple-500/30 py-[10px] px-[15px]">
            <span className="bg-gradient-to-r from-blue-600 to-blue-200 bg-clip-text text-transparent">
              {String(days).padStart(2, '0')}
            </span>
            <p className="text-sm md:text-base text-gray-400">дней</p>
          </div>
          <span className="text-gray-500">:</span>

          <div className="text-center bg-shadow-inset-primary backdrop-blur-xs rounded-3xl border border-purple-500/30 py-[10px] px-[15px]">
            <span className="text-white bg-clip-text text-transparent">
              {String(hours).padStart(2, '0')}
            </span>
            <p className="text-sm md:text-base text-gray-400">часов</p>
          </div>
          <span className="text-gray-500">:</span>

          <div className="text-center bg-shadow-inset-primary backdrop-blur-xs rounded-3xl border border-purple-500/30 py-[10px] px-[15px]">
            <span className="text-white bg-clip-text text-transparent">
              {String(minutes).padStart(2, '0')}
            </span>
            <p className="text-sm md:text-base text-gray-400">мин</p>
          </div>
          <span className="text-gray-500">:</span>

          <div className="text-center bg-shadow-inset-primary backdrop-blur-xs rounded-3xl border border-purple-500/30 py-[10px] px-[15px]">
            <span className="bg-gradient-to-r from-red-200 to-red-600 bg-clip-text text-transparent animate-pulse">
              {String(seconds).padStart(2, '0')}
            </span>
            <p className="text-sm md:text-base text-gray-400">сек</p>
          </div>
        </div>
      )}
    </div>
</div>

  );
};