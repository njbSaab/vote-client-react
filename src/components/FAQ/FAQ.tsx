// src/components/FAQ.tsx
const faqItems = [
  {
    id: 1,
    title: 'Это бесплатно?',
    description:
      'Да, полностью. Вы просто должны подтвердить имейл и в случае правильного прогноза мы пришлем бонус на почту в день события',
  },
  {
    id: 2,
    title: 'Что, если я не угадаю?',
    description: 'Не расстраивайся! Мы периодически делаем новые опросы, ты можешь участвовать в них',
  },
  {
    id: 3,
    title: 'Нужна ли регистрация на сайте?',
    description: 'Нет, только почта для отправки бонуса',
  },
];

export const FAQ = () => {
  return (
    <section className="faq relative overflow-hidden mb-8 pb-8" id="faq">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
          FAQ
        </h2>

        {/* Аккордеон */}
        <div className="grid grid-cols-1 gap-4 md:gap-8 max-w-screen-md mx-auto">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`
                collapse collapse-arrow rounded-3xl overflow-hidden transition-all duration-500
                ${item.id === 1 ? 'glow-white' : ''}
                ${item.id === 2 ? 'glow-red' : ''}
                ${item.id === 3 ? 'glow-blue' : ''}
              `}
            >
              {/* Радио-инпут для группового поведения (DaisyUI collapse) */}
              <input
                type="radio"
                name="faq-accordion"
                id={`faq-${item.id}`}
                defaultChecked={item.id === 1} // первый открыт по умолчанию
              />

              {/* Заголовок */}
              <label
                htmlFor={`faq-${item.id}`}
                className="collapse-title text-xl font-bold cursor-pointer flex items-center justify-between py-4 md:py-6 px-8"
              >
                {item.title}
              </label>

              {/* Контент */}
              <div className="collapse-content px-8 text-white/60">
                <p className="text-lg leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};