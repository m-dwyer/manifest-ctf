import { supabase } from "lib/supabaseClient";

import { supabaseServerClient } from "@supabase/auth-helpers-nextjs";

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from "next/types";
import { Challenge } from "types/Challenge";

// interface Props {
//   challenge: Challenge;
// }

const ChallengePage = ({ challenge }: { challenge: Challenge }) => {
  console.log("props: ", challenge);

  return (
    <div>
      <h1>{challenge.name}</h1>
      <p>{challenge.description}</p>
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
    .select("name, description")
    .eq("id", challengeId);

  console.log("found", data);

  if (data == null || data.length == 0) {
    context.res.setHeader("Location", "/");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }

  return {
    props: { challenge: data[0] },
  };
}

export default ChallengePage;
