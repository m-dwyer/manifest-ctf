import { useState } from "react";
import { supabase } from "lib/supabaseClient";

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Log in</div>
          <form className="form-control">
            <label className="label" htmlFor="username">
              email
            </label>
            <input
              className="input"
              type="text"
              id="username"
              name="username"
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
            ></input>
            <label className="label" htmlFor="confirmPassword">
              confirm
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
            ></input>
            <button className="btn mt-10" type="submit">
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
