import LoginForm from "@/base/components/LoginForm";
import { getCsrfToken } from "next-auth/react";
import { GetServerSidePropsContext } from "next/types";

const Login = ({ csrfToken }: { csrfToken: string }) => {
  return (
    <>
      <LoginForm csrfToken={csrfToken} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
}

export default Login;
