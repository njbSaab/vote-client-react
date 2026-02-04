// src/components/MainPrize.tsx
import { useState } from 'react';
import type { Event } from '@/types';

interface MainPrizeProps {
  event: Event | null | undefined; 
}

export const MainPrize = ({ event }: MainPrizeProps) => {
  const [isVisible, setIsVisible] = useState(false); 

  if (!event) {
    return (
      <section className="py-16 text-center text-gray-500">
        Призы пока недоступны
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 relative overflow-hidden" id="main-prize">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
          Главный приз
        </h2>

        <div className="max-w-screen-md mx-auto my-8">
          {/* Главный приз — большая карточка */}
          <div 
            className="
              glow-breath 
              bg-black/40 backdrop-blur-xl 
              rounded-3xl 
              p-10 md:p-12 
              text-center 
              border border-purple-500/30 
              shadow-2xl shadow-purple-900/30 
              mx-auto
              max-w-[600px]
            "
          >
            <h3 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent w-fit mx-auto">
              {event?.grandPrize || 'Выиграй главный приз!'}
            </h3>
          </div>

          {/* Текст-клик для раскрытия списка */}
          <p 
            className="text-center text-white/80 mt-10 text-xl md:text-3xl cursor-pointer hover:text-white transition-colors"
            onClick={() => setIsVisible(!isVisible)}
          >
            Каждый прогноз — <br /> 
            <span className="text-2xl md:text-4xl">
              {isVisible ? '' : '👇'}
            </span>
             {' '}это твой шанс выиграть главный приз!{' '}
            <span className="text-2xl md:text-4xl">
              {isVisible ? '' : '👇'}
            </span>
            {!isVisible && (
            <span className='present text-[130px] flex justify-center items-center pt-[30px] scale-anim'>
                🎁
            </span>
            )}
          </p>

          {/* Раскрываемый список призов */}
          {isVisible && (
            <ul className="mt-8 text-lg md:text-xl text-white/80 bg-black/50 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-purple-500/20 shadow-xl max-w-[600px] mx-auto">
              <li className="text-2xl md:text-3xl font-bold mb-4 text-center">
                <span className='mr-4 scale-anim'>🎁</span>
                <span className='bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent'>
                   Главный приз: {event?.grandPrize || 'Первый приз'}
                </span>         
              </li>
              <li className="text-xl md:text-2xl text-red-300 max-w-[280px] mx-auto">
                 🎁 20 баллов — {event?.forEveryPrize || 'Чашка'}
              </li>
              <li className="text-xl md:text-2xl text-blue-300 mt-2 max-w-[280px] mx-auto">
                 🎁 30 баллов — {event?.forEveryPrize || 'Футболка'}
              </li>
              <li className="text-xl md:text-2xl max-w-[280px] mt-2 mx-auto">
                🎁 50 баллов — {event?.forEveryPrize || 'Куртка'}
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};