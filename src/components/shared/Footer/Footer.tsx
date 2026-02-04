// src/components/Footer.tsx
const socialLinks = [
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

export default function Footer() {
  return (
    <footer className="
        h-full py-6 pb-4 md:pt-12 footer overflow-x-hidden overflow-y-auto bg-gradient-main-accent container md:max-w-[779px]
    ">
      <div className="container mx-auto px-4">
        <div className="
          footer-social-items 
          max-w-screen-md mx-auto 
          flex flex-col items-center
        ">
          {/* Социальные сети */}
          <ul className="
            flex items-center justify-center 
            gap-[5px] md:gap-8 
            flex-wrap
          ">
            {socialLinks.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.title}
                  className="
                    social-link 
                    flex items-center justify-center 
                    w-[50px] h-[50px] md:w-[64px] md:h-[64px]
                    bg-white/10 backdrop-blur-md 
                    border border-white/20 
                    rounded-2xl
                    transition-all duration-300
                    hover:bg-white/20
                    hover:scale-105
                    hover:-translate-y-1
                    hover:shadow-xl
                    hover:shadow-black/40
                    hover:border-white/40
                  "
                >
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className="w-8 h-8 md:w-12 md:h-12"
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Копирайт */}
          <div className="mt-4 md:mt-8 text-sm text-white/70">
            © 2025 site. Все права защищены
          </div>
        </div>
      </div>
    </footer>
  );
}