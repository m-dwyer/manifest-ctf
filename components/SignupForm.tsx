import { useState } from "react";
import { supabase } from "lib/supabaseClient";

const SignupForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (event: Event) => {
    event.preventDefault();

    if (confirmPassword !== password) {
      alert("Passwords do not match");
    }

    const { error, session } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
  };

  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Sign up</div>
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
            <label className="label" htmlFor="confirmPassword">
              confirm
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <button
              className="btn mt-10"
              type="submit"
              onClick={(e) => handleSignup(e)}
            >
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
