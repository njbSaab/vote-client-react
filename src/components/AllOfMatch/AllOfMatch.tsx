// src/components/AllOfMatches.tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Event } from '@/types';
import MatchCard from '@/components/ui/EventCarst/EventCart';
import { useCarouselEvents } from '@/hooks/useCarouselEvents';
import { VoteButton } from '../ui/VoteButton/VoteButton';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '@/hooks/useWindowSize';

export const AllOfMatches = () => {
  const { events: rawEvents, loading, error } = useCarouselEvents();
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cubeRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const prevIndexRef = useRef<number>(0);
  const navigate = useNavigate();

  const handleVoteClick = () => {
    if (!currentEvent?.id) return;
    navigate(`/vote/${currentEvent.id}`);
  };

  // Дублируем события до 4 штук
  useEffect(() => {
    if (loading || error || rawEvents.length === 0) {
      setDisplayEvents([]);
      stopAutoPlay();
      return;
    }

    let source = [...rawEvents];
    while (source.length < 4 && source.length > 0) {
      source = [...source, ...source];
    }
    setDisplayEvents(source.slice(0, 4));
  }, [rawEvents, loading, error]);

  // Автозапуск
  useEffect(() => {
    if (displayEvents.length === 0) return;
    startAutoPlay();
    return () => stopAutoPlay();
  }, [displayEvents]);

  // Реакция на смену индекса
  useEffect(() => {
    if (displayEvents.length === 0 || !cubeRef.current) return;

    const prev = prevIndexRef.current;
    let targetAngle = currentIndex * -90;

    if (prev === 3 && currentIndex === 0) {
      targetAngle = -360;
    } else if (prev === 0 && currentIndex === 3) {
      targetAngle = 90;
    }

    gsap.to(cubeRef.current, {
      rotationY: targetAngle,
      ease: "power2.inOut",
      onComplete: () => {
        if (cubeRef.current) {
          gsap.set(cubeRef.current, { rotationY: currentIndex * -90 });
        }
      }
    });

    prevIndexRef.current = currentIndex;
  }, [currentIndex, displayEvents]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 4);
    }, 6000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    stopAutoPlay();
  };

  // ← Оставляем объявление здесь, перед рендером
  const currentEvent = displayEvents[currentIndex];

  const { width } = useWindowSize();

  const isMobile = width <= 756;

  // Динамические размеры
  const sceneWidth = isMobile ? 320 : 520;
  const sceneHeight = isMobile ? 220 : 350;
  const translateZ = isMobile ? 160 : 260;
  const perspective = isMobile ? '1200px' : '2000px';

  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="skeleton h-[350px] w-full max-w-[520px] mx-auto rounded-3xl"></div>
      </section>
    );
  }

  if (error || displayEvents.length === 0) {
    return (
      <section className="py-16 text-center text-error text-xl">
        {error || 'Нет доступных событий'}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-12 md:py-16" id="all-of-matches">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
          Текущие события
        </h2>

        <div 
            className="scene mx-auto transition-all duration-300"
            style={{ 
              width: `${sceneWidth}px`, 
              height: `${sceneHeight}px`, 
              perspective: perspective 
            }}
          >
            <div 
              ref={cubeRef} 
              className="cube w-full h-full relative" 
              style={{ transformStyle: 'preserve-3d' }}
            >
              {displayEvents.map((event, i) => (
                <div
                  key={event.id}
                  className="cube-face absolute w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    transform: `rotateY(${i * 90}deg) translateZ(${translateZ}px)`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <MatchCard event={event} />
                </div>
              ))}
            </div>
          </div>

        <div className="flex justify-center gap-4 mt-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'bg-white scale-150 shadow-glow' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {currentEvent && (
          <div className="mt-8 text-center max-w-[520px] mx-auto">
            <VoteButton onClick={handleVoteClick} disabled={!currentEvent.id}>
             {loading ? '<span class="loading loading-spinner"></span> Голосуем...' : 'Сделать прогноз'}
            </VoteButton>
          </div>
        )}
      </div>
    </section>
  );
};