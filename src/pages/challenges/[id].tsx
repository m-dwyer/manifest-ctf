import { useState } from "react";
import { GetServerSidePropsContext } from "next/types";
import Link from "next/link";

import { prisma } from "@/common/providers/prismaClient";

import Modal from "@/common/components/Modal";
import { useSubmitAttempt } from "@/challenges/queries/submissions";
import { useQueryClient } from "@tanstack/react-query";
import { Submission, submissionSchema } from "@/challenges/schemas/submission";
import { Form } from "@/common/components/Form";
import { FieldValues } from "react-hook-form";
import { InputField } from "@/common/components/InputField";
import { Challenge, ChallengeAttempt } from "@prisma/client";

type ChallengeWithFiles = Challenge &
  ChallengeAttempt & {
    files?: [{ fileName: string; publicUrl: string }];
  };

const ChallengePage = ({ challenge }: { challenge: ChallengeWithFiles }) => {
  const [modalState, setModalState] = useState<{
    title?: string;
    text?: string | null;
  }>({});
  const [modal, setModal] = useState(false);
  const handleDismiss = () => setModal(false);

  const queryClient = useQueryClient();
  const submitAttemptMutation = useSubmitAttempt();

  const handleSubmitFlag = async (data: FieldValues) => {
    const submissionResult = await submitAttemptMutation.mutateAsync(
      data as Submission
    );

    if (submissionResult.data?.correct) {
      queryClient.invalidateQueries(["challenges"]);
      setModalState({
        title: "Correct!",
        text: "That flag is correct!",
      });
      setModal(true);
    } else {
      setModalState({
        title: "Incorrect",
        text: "Sorry, that is not the correct flag",
      });
      setModal(true);
    }
  };

  return (
    <div className="prose lg:prose-sm mx-auto">
      <h1>{challenge.name}</h1>
      <p>{challenge.description}</p>
      <div>
        <p>Files</p>
        <ul>
          {(challenge.files || []).map((f) => (
            <li key={f.fileName}>
              <Link href={f.publicUrl}>{f.fileName}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Form schema={submissionSchema} submitHandler={handleSubmitFlag}>
        <InputField
          type="hidden"
          hidden={true}
          name="challenge"
          value={challenge?.id}
          options={{ valueAsNumber: true }}
        />

        <InputField name="flag" type="text" />
        <button className="btn" type="submit">
          Submit flag
        </button>
      </Form>
      {modal ? (
        <Modal handleDismiss={handleDismiss}>
          <h3 className="font-bold text-lg">{modalState.title}</h3>
          <p className="py-4">{modalState.text}</p>
        </Modal>
      ) : null}
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const challengeId = Number(context.params?.id);

  if (!challengeId) {
    context.res.setHeader("Location", "/challenges");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }

  const result = await prisma.challenge.findFirst({
    select: {
      name: true,
      description: true,
      flag: true,
      challengeAttempt: {
        where: {
          challengeId: challengeId,
          userId: 1,
        },
      },
    },
    where: {
      id: challengeId,
    },
  });

  if (result === null) {
    context.res.setHeader("Location", "/");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }

  // TODO: Find challenge files for this challenge!

  return {
    props: { challenge: { files: [], ...result } },
  };
}

export default ChallengePage;
