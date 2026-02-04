// src/components/Header.tsx
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from '@/hooks/useWindowSize'; // создадим ниже, либо используй usehooks-ts

// НЕ нужно импортировать внешние изображения через import from 'https://...'

const socials = [
  {
    id: 1,
    link: 'https://vietget.xyz/vietget?link=2',
    icon: 'https://devgame.pro/images/image-1769716121786-280406994.svg',
    title: 'tiktok',
  },
  {
    id: 2,
    link: 'https://vietget.xyz/vietget?link=1',
    icon: 'https://devgame.pro/images/image-1769716107986-454502908.svg',
    title: 'youtube',
  },
  {
    id: 3,
    link: 'https://vietget.xyz/vietget?link=4',
    icon: 'https://devgame.pro/images/image-1769716144605-296838104.svg',
    title: 'instagram',
  },
  // { id: 4, link: 'https://vietget.xyz/vietget?link=4', icon: '/assets/images/main-pg/social/4.svg', title: 'twitter' },  // ← если локальный — можно оставить import или тоже строку
  {
    id: 5,
    link: 'https://vietget.xyz/vietget?link=3',
    icon: 'https://devgame.pro/images/image-1769716150662-241636438.svg',
    title: 'facebook',
  },
  {
    id: 6,
    link: 'https://vietget.xyz/vietget?link=5',
    icon: 'https://devgame.pro/images/image-1769716135263-404404423.svg',
    title: 'telegram',
  },
];

// sections остаётся без изменений, там нет импортов
const sections = [
  { id: 'hero', label: 'Main page', hover: 'hover-white' },
  { id: 'how-it-work', label: 'How it works', hover: 'hover-red' },
  { id: 'all-of-matches', label: 'All of votes', hover: 'hover-blue' },
  { id: 'faq', label: 'FAQ', hover: 'hover-white' },
];

export default function Header() {
  
  const location = useLocation();

  const [activeSection, setActiveSection] = useState('hero');
  const [isHomePage, setIsHomePage] = useState(location.pathname === '/');

  const drawerRef = useRef<HTMLInputElement>(null);
  const isMobile = useWindowSize().width <= 768;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsHomePage(location.pathname === '/');
  }, [location.pathname]);

  // Плавный скролл к секции
  const scrollToSection = (id: string) => {
    if (!isHomePage) return;

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }

    // Закрываем меню на мобильных
    if (isMobile && drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  // Слушатель скролла
  useEffect(() => {
    const handleScroll = () => {
      // Добавляем класс, когда проскроллили хотя бы 1 пиксель (можно поставить 50–100)
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // проверяем сразу при монтировании

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Отслеживание текущей видимой секции
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // начальная проверка

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  return (
    <header className="header fixed top-0 left-0 right-0 z-[100]">
      <div className="container mx-auto">
        <div className="drawer drawer-end">
          <input
            id="my-drawer-5"
            type="checkbox"
            className="drawer-toggle"
            ref={drawerRef}
          />

          {/* Основная строка хедера (видна всегда) */}
          <div 
          className={`
        drawer-content flex justify-between w-full max-w-[779px] px-4 py-4 mx-auto backdrop-blur-lg rounded-[30px]
        ${isScrolled ? 'color-full-gradient shadow-lg' : 'backdrop-blur-lg'}
      `}
          >
            <img
              src="https://i.ibb.co/Qvd3RYXX/5.png"
              alt="Logo"
              className="h-10 w-auto"
            />

            <label
              htmlFor="my-drawer-5"
              className="btn btn-circle swap swap-rotate bg-gradient-main-accent"
            >
              {/* burger */}
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              {/* крестик */}
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="368 192 256 304 144 192 114.67 221.33 256 362.67 397.33 221.33 368 192" />
              </svg>
            </label>
          </div>

          {/* Боковое меню */}
          <div className="drawer-side z-[200]">
            <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay" />

            <ul className="menu bg-shadow-inset backdrop-blur-lg min-h-full w-[90%] md:w-[400px] p-8 space-y-4 relative border border-purple-500/40">
              {/* Логотип + Login / Back */}
              <li className="flex login-items items-center justify-between flex-row">
                <img src="https://i.ibb.co/Qvd3RYXX/5.png" className="p-0" alt="Logo" />

                {isHomePage ? (
                  <Link
                    to="/auth" // или "/auth" — подставь нужный путь
                    className="no-underline"
                  >
                    <span className="text-lg p-2 gap-0 hover-gradient login-btn rounded-[25px] flex items-center">
                      Login
                      <svg
                        className="p-0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="55"
                        height="55"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M9 2h9c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-2h2v2h9V4H9v2H7V4c0-1.1.9-2 2-2"
                        />
                        <path
                          fill="currentColor"
                          d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67z"
                        />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="no-underline"
                    onClick={() => {
                      if (drawerRef.current) drawerRef.current.checked = false;
                    }}
                  >
                    <span className="text-lg p-2 gap-0 hover-gradient login-btn rounded-[25px] flex items-center">
                      Back to
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="55"
                        height="55"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M5 19V9.452l-2.396 1.779l-.598-.787L12 3l10.02 7.439l-.604.792L12 4.25L6 8.716V18h2.673v1zm9.637 2l-3.533-3.538l.708-.714l2.825 2.825l5.675-5.65l.688.714z"
                        />
                      </svg>
                    </span>
                  </Link>
                )}
              </li>

              {/* Навигация */}
              {sections.map((section) => (
                <li key={section.id} className="w-full">
                  {isHomePage ? (
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        rounded-[35px] text-center block text-xl font-medium py-[15px] md:py-5 
                        transition-all duration-300 cursor-pointer nav-link
                        ${section.hover}
                        ${activeSection === section.id ? 'active' : ''}
                      `}
                    >
                      {section.label}
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="
                        rounded-[35px] text-center block text-xl font-medium py-[15px] md:py-5 
                        transition-all duration-300 hover-gradient
                      "
                      onClick={() => {
                        if (drawerRef.current) drawerRef.current.checked = false;
                      }}
                    >
                      {section.label}
                    </Link>
                  )}
                </li>
              ))}

              {/* Соцсети + копирайт (прижаты вниз) */}
              <div className="absolute bottom-8 left-0 right-0 px-8">
                <ul className="flex items-center justify-center gap-[8px] mb-6">
                  {socials.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-10 h-10"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <span className="block text-center text-sm text-white/60">
                  © 2025 site. Все права защищены
                </span>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}