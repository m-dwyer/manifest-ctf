import { ChallengeCategory } from "./Category";


export type Challenge = {
  id: number;
  name: string;
  challenge_categories: [ChallengeCategory];
  description: string;
  flag: string;
  points: number;
};

export type ChallengeCompleted = Challenge & {
  challenge_attempts: [{completed: boolean}]
}