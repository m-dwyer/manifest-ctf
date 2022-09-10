import "@/challenges/components/ChallengeCard";
import ChallengeCard from "@/challenges/components/ChallengeCard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChallengeWithCompletion } from "../types/Challenge";

describe("ChallengeCard", () => {
  it("renders", () => {
    const challenge: ChallengeWithCompletion = {
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      challenge_attempts: [
        {
          completed: false,
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
    const challenge: ChallengeWithCompletion = {
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      challenge_attempts: [
        {
          completed: true,
        },
      ],
    };

    render(<ChallengeCard challenge={challenge} />);

    const challengeCompleted = screen.getByTitle("completed");

    expect(challengeCompleted).toBeInTheDocument();
  });

  it("it does not reveal the flag", () => {
    const challenge: ChallengeWithCompletion = {
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      challenge_attempts: [
        {
          completed: true,
        },
      ],
    };

    render(<ChallengeCard challenge={challenge} />);

    const flagText = screen.queryByText("7h3_fl4g_15_h3r3");
    expect(flagText).not.toBeInTheDocument();
  });
});
