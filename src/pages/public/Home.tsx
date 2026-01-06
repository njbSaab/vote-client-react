// src/pages/Home.tsx
import { AllOfMatches } from '@/components/AllOfMatch/AllOfMatch';
import { FAQ } from '@/components/FAQ/FAQ';
import { HowItWorks } from '@/components/HowItWork/HowItWork';
import { MainEvent } from '@/components/MainEvent/MainEvent';
import { MainPrize } from '@/components/MainPrize/MainPrize';
import { useEventStore } from '@/stores/eventStore';
import { useEffect } from 'react';

export default function Home() {
  const { mainEvent, fetchMainEvent } = useEventStore();

  useEffect(() => {
    if (!mainEvent) fetchMainEvent();
  }, [mainEvent, fetchMainEvent]);

  return (
    <div className="bg-gradient-to-b from-black via-[#0a001f] to-black text-white min-h-screen">
      <MainEvent />
      <MainPrize event={mainEvent} /> 
      <HowItWorks />
      <AllOfMatches />
      <FAQ />
    </div>
  );
}