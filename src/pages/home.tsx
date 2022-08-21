import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import type { NextPage } from "next";

import HomePage from "components/HomePage";

const Home: NextPage = () => {
  return (
    <>
      <HomePage />
    </>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

export default Home;
