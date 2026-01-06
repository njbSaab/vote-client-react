// src/types/event.types.ts
export interface Event {
  id: number
  typeEventId: string
  title: string
  sport: string
  participantA: string
  participantB: string
  logoA?: string
  logoB?: string
  eventStartsAt: string
  votingEndsAt: string
  totalVotes: number
  votesA: number
  votesB: number
  votesDraw: number
  percentageA: number
  percentageB: number
  percentageDraw: number
  hasVotingEnded: boolean
  userAlreadyVoted: boolean
  userChoice: 1 | 2 | 3 | null
  imageBgDesktop?: string
  imageBgMobile?: string
  grandPrize?: string
  forEveryPrize: null | string,
  isPublic: boolean
  isMainEvent: boolean
  status: 'active' | 'inactive' | 'ended'
}