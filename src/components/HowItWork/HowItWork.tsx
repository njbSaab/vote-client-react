// src/components/HowItWorks.tsx
import img1 from '@/assets/images/main-pg/how-it-work/1.png';
import img2 from '@/assets/images/main-pg/how-it-work/2.png';
import img3 from '@/assets/images/main-pg/how-it-work/3.png';

const steps = [
  {
    id: 1,
    image: img1,
    title: 'Выбираешь матч',
    description: '– топовые события недели (футбол, баскетбол, теннис)',
  },
  {
    id: 2,
    image: img2,
    title: 'Делаешь прогноз',
    description: '– угадываешь счет или победителя.',
  },
  {
    id: 3,
    image: img3,
    title: 'Получаешь бонус',
    description: '– 500 баллов за участие + шанс выиграть приз за точный прогноз.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="pb-12 md:pb-16 bg-gradient-to-b from-[#0a001f] to-black relative overflow-hidden" id="how-it-work">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
          Как это работает
        </h2>

        {/* Список шагов */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 max-w-screen-md mx-auto">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`
                flex items-center gap-6 md:gap-10 
                px-6 py-8 md:p-10 
                rounded-3xl 
                bg-black/40 backdrop-blur-xl 
                border border-purple-500/20 
                shadow-2xl shadow-purple-900/30 
                transition-all duration-500 
                hover:scale-[1.02] hover:shadow-purple-700/50
                glow-step-${step.id}
              `}
            >
              {/* Изображение */}
              <img
                src={step.image}
                alt={step.title}
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
              />

              {/* Текст */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {step.id}. {step.title}
                </h3>
                <p className="text-gray-300 text-base md:text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};