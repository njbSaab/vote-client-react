// src/pages/Home.tsx
import { AllOfMatches } from '@/components/AllOfMatch/AllOfMatch';
import { FAQ } from '@/components/FAQ/FAQ';
import { HowItWorks } from '@/components/HowItWork/HowItWork';
import { MainEvent } from '@/components/MainEvent/MainEvent';
import { MainPrize } from '@/components/MainPrize/MainPrize';
import Footer from '@/components/shared/Footer/Footer';
import Header from '@/components/shared/Header/Header';
import { useEventStore } from '@/stores/eventStore';
import { useEffect } from 'react';

export default function Home() {
  const { mainEvent, fetchMainEvent } = useEventStore();

  useEffect(() => {
    if (!mainEvent) fetchMainEvent();
  }, [mainEvent, fetchMainEvent]);

  return (
    <div className="bg-gradient-main text-white min-h-screen">
      <Header />
      <MainEvent />
      <MainPrize event={mainEvent} /> 
      <HowItWorks />
      <AllOfMatches />
      <FAQ />
      <Footer/>
      </div>
  );
}