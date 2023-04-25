import ChallengeCard from "@/challenges/components/ChallengeCard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChallengeWithCompletion } from "@/challenges/schemas/challenge";
import { Challenge, ChallengeAttempt } from "@prisma/client";
import "@testing-library/jest-dom";

/**
 * @group unit
 * @group components
 */
describe("ChallengeCard", () => {
  it("renders", () => {
    const challenge: Challenge & { challengeAttempt: ChallengeAttempt[] } = {
      id: 1,
      created_at: new Date(),
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      categoryId: 123,
      deleted: null,
      challengeAttempt: [
        {
          completed: false,
          attempts: 1,
          created_at: new Date(),
          challengeId: 1,
          userId: 1,
          points_scored: 1,
        },
      ],
    };

    render(<ChallengeCard challenge={challenge} />);

    const challengeNameText = screen.getByText("My cool crypto challenge");
    const challengeDescriptionText = screen.getByText(
      "Can you decipher the text?"
    );
    const challengePointsText = screen.getByText("123 points");

    expect(challengeNameText).toBeInTheDocument();
    expect(challengeDescriptionText).toBeInTheDocument();
    expect(challengePointsText).toBeInTheDocument();
  });

  it("renders with completion", () => {
    const challenge: Challenge & { challengeAttempt: ChallengeAttempt[] } = {
      id: 1,
      created_at: new Date(),
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      categoryId: 123,
      deleted: null,
      challengeAttempt: [
        {
          completed: true,
          attempts: 1,
          created_at: new Date(),
          challengeId: 1,
          userId: 1,
          points_scored: 1,
        },
      ],
    };

    render(<ChallengeCard challenge={challenge} />);

    const challengeCompleted = screen.getByTitle("completed");

    expect(challengeCompleted).toBeInTheDocument();
  });

  it("it does not reveal the flag", () => {
    const challenge: Challenge & { challengeAttempt: ChallengeAttempt[] } = {
      id: 1,
      created_at: new Date(),
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      categoryId: 123,
      deleted: null,
      challengeAttempt: [
        {
          completed: true,
          attempts: 1,
          created_at: new Date(),
          challengeId: 1,
          userId: 1,
          points_scored: 1,
        },
      ],
    };

    render(<ChallengeCard challenge={challenge} />);

    const flagText = screen.queryByText("7h3_fl4g_15_h3r3");
    expect(flagText).not.toBeInTheDocument();
  });
});
