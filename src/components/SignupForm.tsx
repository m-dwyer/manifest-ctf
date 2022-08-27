import { useState, MouseEvent } from "react";

import { useMultiInputs } from "@/lib/hooks/useMultiInputs";
import { signUp } from "@/services/authentication";

const SignupForm = () => {
  const [formData, setFormData] = useMultiInputs({
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (event: MouseEvent) => {
    event.preventDefault();

    if (formData.confirm !== formData.password) {
      alert("Passwords do not match");
    }

    const { user, session, error } = await signUp(
      formData.email,
      formData.password
    );

    if (error) {
      setError(error.message);
    }
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
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
            ></input>
            <label className="label" htmlFor="password">
              password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ password: e.target.value })}
            ></input>
            <label className="label" htmlFor="confirmPassword">
              confirm
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              value={formData.confirm}
              onChange={(e) => setFormData({ confirm: e.target.value })}
            ></input>
            <button className="btn mt-10" type="submit" onClick={handleSignup}>
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
