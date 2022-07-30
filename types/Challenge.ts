export type Challenge = {
  id: number;
  name: string;
  category: string;
  description: string;
  flag: string;
  points: number;
};

export type ChallengeCompleted = Challenge & {
  challenge_attempts: [{completed: boolean}]
}