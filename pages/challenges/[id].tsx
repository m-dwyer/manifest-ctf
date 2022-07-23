import { supabase } from "lib/supabaseClient";

import { supabaseServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSidePropsContext } from "next/types";
import { Challenge } from "types/Challenge";
import { SyntheticEvent, useState } from "react";

const ChallengePage = ({ challenge }: { challenge: Challenge }) => {
  const [flag, setFlag] = useState<string | null>(null);

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
  };

  return (
    <div>
      <h1>{challenge.name}</h1>
      <p>{challenge.description}</p>
      <form className="form-control" onSubmit={handleSubmitFlag}>
        <input
          className="input"
          type="text"
          placeholder="Enter flag"
          id="flag"
          name="flag"
          onChange={(e) => setFlag(e.target.value)}
        ></input>
        <button className="btn mt-10" type="submit">
          Submit flag
        </button>
      </form>
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

  if (data == null) {
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
