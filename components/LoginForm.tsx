import { useState, MouseEvent } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
// import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: MouseEvent) => {
    e.preventDefault();
    const { error } = await supabaseClient.auth.signIn({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Log in </div>
          {error != null && <div>{error}</div>}
          <form className="form-control">
            <label className="label" htmlFor="email">
              email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <label className="label" htmlFor="password">
              password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button className="btn mt-10" type="submit" onClick={handleLogin}>
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
