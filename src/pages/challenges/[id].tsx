import { SyntheticEvent, useState } from "react";
import { supabaseServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next/types";
import Link from "next/link";

import { Challenge } from "@/types/Challenge";
import Modal from "@/components/Modal";
import { submitAttempt } from "@/services/submissions";

type ChallengeWithFiles = Challenge & {
  files: [{ fileName: string; publicUrl: string }];
};

const ChallengePage = ({ challenge }: { challenge: ChallengeWithFiles }) => {
  const [flag, setFlag] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    title?: string;
    text?: string | null;
  }>({});
  const [modal, setModal] = useState(false);
  const handleDismiss = () => setModal(false);

  const handleSubmitFlag = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!challenge || !challenge.id || !flag) return;

    const submissionResult = await submitAttempt(challenge.id, flag);
    if (submissionResult.correct) {
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

  const { data: fileList, error } = await supabaseServerClient(context)
    .storage.from("challenge_files")
    // .list("/", {
    .list(`${data.name.replace(/\s/g, "_")}`, {
      sortBy: { column: "name", order: "asc" },
    });

  const publicUrlPromises = Array.from(fileList || []).map(async (f) => {
    const file = await supabaseServerClient(context)
      .storage.from("challenge_files")
      .getPublicUrl(`${data.name.replace(/\s/g, "_")}/${f.name}`);
    return { fileName: f.name, publicUrl: file.data?.publicURL };
  });

  const fileUrls = await (
    await Promise.all(publicUrlPromises)
  ).map((r) => ({ fileName: r.fileName, publicUrl: r.publicUrl }));

  return {
    props: { challenge: { files: fileUrls, ...data } },
  };
}

export default ChallengePage;
