import { Category } from "./Category";

export type Challenge = {
  id?: number;
  name: string;
  description: string;
  flag: string;
  points: number;
};

export type ChallengeWithCategories = Challenge & {
  category: Category;
};

export type ChallengeWithCompletion = Challenge & {
  challenge_attempts: [{ completed: boolean }];
};
