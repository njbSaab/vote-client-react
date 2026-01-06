export interface User {
  uuid: string;
  email: string;
  name: string;
  emailVerified: boolean;
  points?: number;
  totalVotes?: number;
  correctPredictions?: number;
  votesHistory?: any[];
  stats?: any;
}
