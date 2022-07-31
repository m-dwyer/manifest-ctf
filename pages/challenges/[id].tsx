import { supabaseServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSidePropsContext } from "next/types";
import { Challenge } from "types/Challenge";
import { SyntheticEvent, useState } from "react";

import Modal from "components/Modal";

const ChallengePage = ({ challenge }: { challenge: Challenge }) => {
  const [flag, setFlag] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    title?: string;
    text?: string | null;
  }>({});
  const [modal, setModal] = useState(false);
  const handleDismiss = () => setModal(false);

  const handleSubmitFlag = async (e: SyntheticEvent) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ challenge: challenge.id, flag: flag }),
    };

    const result = await fetch(`/api/submission`, options);
    const json = await result.json();

    if (json.correct) {
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
      <form className="form-control" onSubmit={handleSubmitFlag}>
        <div className="flex gap-1">
          <input
            className="input bg-base-300"
            type="text"
            placeholder="Enter flag"
            id="flag"
            name="flag"
            onChange={(e) => setFlag(e.target.value)}
          ></input>
          <button className="btn" type="submit">
            Submit flag
          </button>
        </div>
      </form>
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
  const challengeId: string = context.params?.id as string;

  if (!challengeId) {
    context.res.setHeader("Location", "/challenges");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }

  const { data } = await supabaseServerClient(context)
    .from<Challenge>("challenges")
    .select("id, name, description")
    .eq("id", challengeId)
    .limit(1)
    .single();

  if (data === null) {
    context.res.setHeader("Location", "/");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }

  return {
    props: { challenge: data },
  };
}

export default ChallengePage;
