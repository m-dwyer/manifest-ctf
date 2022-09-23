import ChallengeForm from "@/challenges/components/ChallengeForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { ChallengeWithCategories } from "@/challenges/types/Challenge";

jest.mock("@tanstack/react-query", () => ({
  __esModule: true,
  useQueryClient: null,
}));
import * as reactQuery from "@tanstack/react-query";

jest.mock("@/challenges/queries/challenges", () => ({
  __esModule: true,
  useUpsertChallenge: null,
}));
import * as challengesQuery from "@/challenges/queries/challenges";

jest.mock("@/challenges/queries/categories", () => ({
  __esModule: true,
  useFetchAllCategories: null,
}));
import * as categoriesQuery from "@/challenges/queries/categories";

jest.mock("@/base/queries/storage", () => ({
  __esModule: true,
  uploadFileToBucket: null,
}));
import * as storageQuery from "@/base/queries/storage";

import { act } from "react-test-renderer";

/**
 * @group unit
 * @group components
 */
describe("ChallengeForm", () => {
  it("renders existing challenge", () => {
    const mockUseQueryClient = reactQuery as { useQueryClient: unknown };
    mockUseQueryClient.useQueryClient = () => ({ invalidateQuery: jest.fn() });

    const mockCategoriesQuery = categoriesQuery as {
      useFetchAllCategories: unknown;
    };
    mockCategoriesQuery.useFetchAllCategories = () => ({
      data: {
        data: [{ id: 1, name: "Default" }],
      },
    });

    const mockChallengesQuery = challengesQuery as {
      useUpsertChallenge: unknown;
    };
    mockChallengesQuery.useUpsertChallenge = () => ({ mutate: jest.fn() });

    const challenge: ChallengeWithCategories = {
      name: "My cool crypto challenge",
      description: "Can you decipher the text?",
      flag: "7h3_fl4g_15_h3r3",
      points: 123,
      category: { id: 1, name: "Default" },
    };

    render(<ChallengeForm challenge={challenge} handleDismiss={() => {}} />);

    const nameInput = screen.queryByLabelText("name") as HTMLInputElement;
    const descriptionInput = screen.queryByLabelText(
      "description"
    ) as HTMLInputElement;
    const categoryInput = screen.queryByLabelText(
      "category"
    ) as HTMLInputElement;
    const flagInput = screen.queryByLabelText("flag") as HTMLInputElement;
    const pointsInput = screen.queryByLabelText("points") as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
    expect(flagInput).toBeInTheDocument();
    expect(pointsInput).toBeInTheDocument();

    expect(nameInput.value).toBe("My cool crypto challenge");
    expect(descriptionInput.value).toBe("Can you decipher the text?");
    expect(categoryInput.value).toBe("1");
    expect(flagInput.value).toBe("7h3_fl4g_15_h3r3");
    expect(pointsInput.value).toBe("123");
  });

  it("renders an empty form when no challenge", () => {
    const mockUseQueryClient = reactQuery as { useQueryClient: unknown };
    mockUseQueryClient.useQueryClient = () => ({ invalidateQuery: jest.fn() });

    const mockCategoriesQuery = categoriesQuery as {
      useFetchAllCategories: unknown;
    };
    mockCategoriesQuery.useFetchAllCategories = () => ({
      data: {
        data: [{ id: 1, name: "Default" }],
      },
    });

    const mockChallengesQuery = challengesQuery as {
      useUpsertChallenge: unknown;
    };
    mockChallengesQuery.useUpsertChallenge = () => ({ mutate: jest.fn() });

    render(<ChallengeForm handleDismiss={() => {}} />);

    const nameInput = screen.queryByLabelText("name") as HTMLInputElement;
    const descriptionInput = screen.queryByLabelText(
      "description"
    ) as HTMLInputElement;
    const categoryInput = screen.queryByLabelText(
      "category"
    ) as HTMLInputElement;
    const flagInput = screen.queryByLabelText("flag") as HTMLInputElement;
    const pointsInput = screen.queryByLabelText("points") as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
    expect(flagInput).toBeInTheDocument();
    expect(pointsInput).toBeInTheDocument();

    expect(nameInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(categoryInput.value).toBe("1");
    expect(flagInput.value).toBe("");
    expect(pointsInput.value).toBe("");
  });

  it("successfully creates a new challenge", async () => {
    const mockUseQueryClient = reactQuery as { useQueryClient: unknown };
    mockUseQueryClient.useQueryClient = () => ({ invalidateQuery: jest.fn() });

    const mockChallengesQuery = challengesQuery as {
      useUpsertChallenge: unknown;
    };
    const mockMutate = jest.fn(() => {});
    mockChallengesQuery.useUpsertChallenge = () => ({ mutate: mockMutate });

    const mockCategoriesQuery = categoriesQuery as {
      useFetchAllCategories: unknown;
    };
    mockCategoriesQuery.useFetchAllCategories = () => ({
      data: {
        data: [{ id: 1, name: "Default" }],
      },
    });

    const mockuploadFileToBucket = storageQuery as {
      uploadFileToBucket: unknown;
    };
    mockuploadFileToBucket.uploadFileToBucket = jest.fn(() => ({
      error: null,
    }));

    const mockFile = new File([new ArrayBuffer(1)], "my file.exe");

    render(<ChallengeForm handleDismiss={() => {}} />);

    const nameInput = screen.queryByLabelText("name") as HTMLInputElement;
    const descriptionInput = screen.queryByLabelText(
      "description"
    ) as HTMLInputElement;
    const categoryInput = screen.queryByLabelText(
      "category"
    ) as HTMLInputElement;
    const fileInput = screen.queryByLabelText("file") as HTMLInputElement;
    const flagInput = screen.queryByLabelText("flag") as HTMLInputElement;
    const pointsInput = screen.queryByLabelText("points") as HTMLInputElement;

    const submitButton = screen.getByText("add");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "My cool challenge" } });
      fireEvent.change(descriptionInput, {
        target: { value: "My challenge description" },
      });
      fireEvent.change(categoryInput, {
        target: { value: "1" },
      });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      fireEvent.change(flagInput, {
        target: { value: "7h15_15_my_fl4g" },
      });
      fireEvent.change(pointsInput, {
        target: { value: "100" },
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockuploadFileToBucket.uploadFileToBucket).toHaveBeenCalledWith(
        "challenge_files",
        "My_cool_challenge/my file.exe",
        mockFile
      );

      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: undefined,
          name: "My cool challenge",
          description: "My challenge description",
          category: "1",
          flag: "7h15_15_my_fl4g",
          points: "100",
        },
        expect.anything()
      );
    });
  });
});
